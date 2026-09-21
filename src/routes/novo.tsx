import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ApontamentoForm } from "@/components/apontamento-form";
import { AppShell } from "@/components/app-shell";
import { GpsBanner } from "@/components/gps-banner";
import { ScreenLoader } from "@/components/screen-loader";
import { addActivity, getSnapshot } from "@/lib/api";
import { openForEquipment } from "@/lib/crew";
import { draftFromApontamento, emptyDraft } from "@/lib/draft";
import { getDeviceId, loadLast, matchStreetByLabel, saveLast, useGps } from "@/lib/geo";
import { usePlaceLabel } from "@/lib/place";
import {
  useCloseApontamento,
  useInvalidateSnapshot,
  usePresencePing,
  useSnapshot,
  useUpsertApontamento,
} from "@/lib/use-snapshot";
import type { Draft } from "@/lib/types";
import { nowHHMM, uid } from "@/lib/utils";

export const Route = createFileRoute("/novo")({
  validateSearch: (raw: Record<string, unknown>): { edit?: string } =>
    typeof raw.edit === "string" && raw.edit ? { edit: raw.edit } : {},
  loader: () => getSnapshot(),
  staleTime: 12_000,
  component: Novo,
});

function Novo() {
  const { edit } = Route.useSearch();
  const navigate = useNavigate();
  const initial = Route.useLoaderData();
  const { data, isLoading } = useSnapshot(initial, true);
  const gps = useGps();
  const upsert = useUpsertApontamento();
  const closeMut = useCloseApontamento();
  const invalidate = useInvalidateSnapshot();
  const last = loadLast();
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(last));
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const idRef = useRef(edit || uid());
  const hydrated = useRef<string | null>(null);
  const streetTouched = useRef(false);
  const matchedStreet = useRef(false);
  const gpsLat = gps.status === "ready" ? gps.lat : null;
  const gpsLng = gps.status === "ready" ? gps.lng : null;
  const gpsAcc = gps.status === "ready" ? gps.accuracy : null;
  const place = usePlaceLabel(gpsLat, gpsLng);

  const current = data?.apontamentos.find((a) => a.id === idRef.current);
  const openRow =
    current && !current.end
      ? current
      : openForEquipment(data?.apontamentos ?? [], draft.equipmentId);
  const isOpenEdit = Boolean(openRow && idRef.current === openRow.id && !draft.ended);

  usePresencePing(gps, {
    workId: draft.workId,
    streetId: draft.streetId,
    equipmentId: draft.equipmentId,
    activityId: draft.activityId,
    apontamentoId: isOpenEdit ? idRef.current : openRow?.id ?? null,
  });

  useEffect(() => {
    if (edit) {
      if (hydrated.current === edit) return;
      const row = data?.apontamentos.find((a) => a.id === edit);
      if (!row) return;
      hydrated.current = edit;
      idRef.current = row.id;
      streetTouched.current = true;
      matchedStreet.current = true;
      setDraft(draftFromApontamento(row));
      return;
    }

    const open = openForEquipment(data?.apontamentos ?? [], last.equipmentId);
    if (open) {
      if (hydrated.current === open.id) return;
      hydrated.current = open.id;
      idRef.current = open.id;
      streetTouched.current = true;
      matchedStreet.current = true;
      setDraft(draftFromApontamento(open));
      return;
    }

    if (hydrated.current !== "new") {
      hydrated.current = "new";
      idRef.current = uid();
      streetTouched.current = false;
      matchedStreet.current = false;
      setDraft(emptyDraft(loadLast()));
    }
  }, [edit, data?.apontamentos, last.equipmentId]);

  useEffect(() => {
    if (edit || isOpenEdit) return;
    if (streetTouched.current || matchedStreet.current) return;
    if (!place.road && !place.label) return;
    if (gpsAcc != null && gpsAcc > 45) return;
    const hit = matchStreetByLabel(place.road || place.label, data?.streets ?? [], draft.workId);
    if (hit && hit.id !== draft.streetId) {
      matchedStreet.current = true;
      setDraft((d) => ({ ...d, streetId: hit.id }));
    }
  }, [edit, isOpenEdit, place.road, place.label, data?.streets, draft.workId, draft.streetId, gpsAcc]);

  function onChangeDraft(next: Draft) {
    if (next.streetId !== draft.streetId) streetTouched.current = true;
    if (next.equipmentId !== draft.equipmentId) {
      const existing = openForEquipment(data?.apontamentos ?? [], next.equipmentId);
      if (existing) {
        hydrated.current = existing.id;
        idRef.current = existing.id;
        streetTouched.current = true;
        matchedStreet.current = true;
        setDraft(draftFromApontamento(existing));
        toast.message("Esta máquina já está em andamento — atualizando a atividade aberta.");
        return;
      }
      if (isOpenEdit) {
        hydrated.current = "new";
        idRef.current = uid();
        streetTouched.current = false;
        setDraft({
          ...emptyDraft({
            workId: next.workId,
            streetId: next.streetId,
            equipmentId: next.equipmentId,
            activityId: "",
          }),
          date: next.date,
        });
        toast.message("A atividade da máquina anterior continua aberta. Esta é uma nova.");
        return;
      }
    }
    setDraft(next);
  }

  async function persist() {
    if (!draft.equipmentId || !draft.activityId || !draft.streetId) return;
    setSaveState("saving");
    try {
      const saved = await upsert.mutateAsync({
        id: idRef.current,
        date: draft.date,
        start: draft.start,
        end: draft.ended && draft.end ? draft.end : null,
        workId: draft.workId,
        streetId: draft.streetId,
        equipmentId: draft.equipmentId,
        activityId: draft.activityId,
        estaca: draft.estaca,
        pv: draft.pv,
        quantity: draft.quantity.trim() === "" ? null : Number(draft.quantity),
        notes: draft.notes,
        lat: gpsLat,
        lng: gpsLng,
        accuracy: gpsAcc,
        locationLabel: place.label,
        deviceId: getDeviceId(),
      });
      idRef.current = saved.id;
      saveLast({
        workId: draft.workId,
        streetId: draft.streetId,
        equipmentId: draft.equipmentId,
        activityId: draft.activityId,
      });
      setSaveState("saved");
      toast.success(
        saved.end
          ? "Atividade encerrada para a equipe"
          : isOpenEdit
            ? "Atividade atualizada — continua aberta até Encerrar"
            : "Atividade aberta para toda a equipe",
      );
      void navigate({ to: "/" });
    } catch {
      setSaveState("error");
    }
  }

  async function encerrar() {
    await closeMut.mutateAsync({ id: idRef.current, end: nowHHMM() });
    toast.success("Atividade encerrada");
    void navigate({ to: "/" });
  }

  if (isLoading && !data) {
    return (
      <AppShell hideNav>
        <ScreenLoader />
      </AppShell>
    );
  }

  return (
    <AppShell hideNav>
      <header className="flex items-center gap-3 px-3 pb-2 pt-[max(12px,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={() => void navigate({ to: "/" })}
          className="flex size-12 items-center justify-center rounded-md text-fg"
          aria-label="Voltar"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-semibold">
            {isOpenEdit ? "Atividade em andamento" : edit ? "Editar apontamento" : "Nova atividade"}
          </h1>
          <p className="text-xs text-muted">
            {isOpenEdit
              ? "Save global: a equipe vê isto até alguém encerrar."
              : "Nada é criado sozinho. Toque em Concluir para abrir a atividade."}
          </p>
        </div>
      </header>
      <div className="px-4 pb-2">
        <GpsBanner gps={gps} />
      </div>
      <main className="px-4">
        <ApontamentoForm
          draft={draft}
          onChange={onChangeDraft}
          onSubmit={() => void persist()}
          submitLabel={isOpenEdit ? "Salvar alterações" : edit ? "Concluir alteração" : "Abrir atividade"}
          works={data?.works ?? []}
          streets={data?.streets ?? []}
          equipment={data?.equipment ?? []}
          activities={data?.activities ?? []}
          gps={gps}
          locationLabel={place.label}
          saveState={saveState}
          openHint={isOpenEdit}
          onEncerrar={isOpenEdit ? () => void encerrar() : undefined}
          onAddActivity={async (name, equipmentId) => {
            const { id } = await addActivity({ data: { name, equipmentId } });
            await invalidate();
            return id;
          }}
        />
      </main>
    </AppShell>
  );
}
