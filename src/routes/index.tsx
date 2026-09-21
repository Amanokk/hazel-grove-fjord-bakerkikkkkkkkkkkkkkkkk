import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock, Plus, Square } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { GpsBanner } from "@/components/gps-banner";
import { LiveCrew } from "@/components/live-crew";
import { collectMarkers, LiveMap } from "@/components/live-map";
import { ScreenLoader } from "@/components/screen-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSnapshot } from "@/lib/api";
import { buildCrew } from "@/lib/crew";
import { getCrewLabel, getDeviceId, loadLast, saveLast, setCrewLabel, useGps } from "@/lib/geo";
import { useCloseApontamento, useLivePresence, usePresencePing, useSnapshot } from "@/lib/use-snapshot";
import { formatDateBR, formatDuration, minutesBetween, nowHHMM, todayISO } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: () => getSnapshot(),
  staleTime: 12_000,
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const initial = Route.useLoaderData();
  const { data, isLoading } = useSnapshot(initial, true);
  const gps = useGps();
  const closeMut = useCloseApontamento();
  const { data: livePresence } = useLivePresence(true, initial.presence);
  const [tick, setTick] = useState(nowHHMM());
  const [last, setLast] = useState(loadLast);
  const [label, setLabel] = useState("");
  const [labelOpen, setLabelOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTick(nowHHMM()), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setLabel(getCrewLabel());
    setLabelOpen(!getCrewLabel());
  }, []);

  const today = todayISO();
  const rows = useMemo(
    () =>
      (data?.apontamentos ?? [])
        .filter((a) => a.date === today)
        .sort((a, b) => a.start.localeCompare(b.start) || a.createdAt.localeCompare(b.createdAt)),
    [data?.apontamentos, today],
  );
  const open = (data?.apontamentos ?? []).filter((a) => !a.end);
  const myOpen = open.find((a) => a.equipmentId === last.equipmentId) ?? open[0];
  const work = data?.works.find((w) => w.id === last.workId);

  const gpsLat = gps.status === "ready" ? gps.lat : null;
  const gpsLng = gps.status === "ready" ? gps.lng : null;
  const gpsAcc = gps.status === "ready" ? gps.accuracy : null;
  const presence = livePresence ?? data?.presence ?? [];
  const deviceId = typeof window === "undefined" ? "" : getDeviceId();

  usePresencePing(gps, {
    ...last,
    apontamentoId: myOpen?.id ?? null,
    activityId: myOpen?.activityId || last.activityId,
    equipmentId: myOpen?.equipmentId || last.equipmentId,
    streetId: myOpen?.streetId || last.streetId,
    workId: myOpen?.workId || last.workId,
  });

  const hours = rows.reduce((acc, a) => acc + minutesBetween(a.start, a.end ?? tick), 0);

  const markers = useMemo(
    () =>
      collectMarkers({
        gps,
        presence,
        apontamentos: [...open, ...rows.filter((a) => a.end)],
        deviceId,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gpsLat, gpsLng, gpsAcc, presence, open, rows, deviceId],
  );

  const crew = useMemo(
    () =>
      buildCrew({
        presence,
        apontamentos: data?.apontamentos ?? [],
        deviceId,
        gps,
        equipment: data?.equipment ?? [],
        activities: data?.activities ?? [],
        streets: data?.streets ?? [],
        works: data?.works ?? [],
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [presence, data?.apontamentos, data?.equipment, data?.activities, data?.streets, data?.works, deviceId, gpsLat, gpsLng],
  );

  function setWork(workId: string) {
    const next = { ...last, workId };
    const first = data?.streets.find((s) => s.active && s.workId === workId);
    if (first) next.streetId = first.id;
    setLast(next);
    saveLast(next);
  }

  if (isLoading && !data) {
    return (
      <AppShell>
        <ScreenLoader />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="px-4 pb-3 pt-[max(16px,env(safe-area-inset-top))]">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Apontador</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h1 className="font-display text-3xl font-semibold leading-none text-fg">{formatDateBR(today)}</h1>
          <p className="text-sm tabular-nums text-muted">{tick}</p>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {(data?.works ?? [])
            .filter((w) => w.active)
            .map((w) => {
              const on = w.id === last.workId;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWork(w.id)}
                  className={
                    on
                      ? "h-9 shrink-0 rounded-full bg-primary px-3 text-sm font-medium text-primary-fg"
                      : "h-9 shrink-0 rounded-full border border-border bg-surface px-3 text-sm text-fg"
                  }
                >
                  {w.code} {w.name}
                </button>
              );
            })}
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 px-4 pb-6">
        <GpsBanner gps={gps} />

        {labelOpen ? (
          <section className="rounded-xl border border-border bg-surface p-3 shadow-card">
            <p className="text-sm font-semibold">Como a equipe te acha no mapa?</p>
            <p className="mb-2 text-xs text-muted">Apelido da frente, código da máquina ou “Equipe 1”.</p>
            <div className="flex gap-2">
              <Input
                value={label}
                maxLength={24}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex.: Frente 1"
              />
              <Button
                onClick={() => {
                  setCrewLabel(label);
                  setLabelOpen(false);
                }}
              >
                Ok
              </Button>
            </div>
          </section>
        ) : null}

        <Link to="/mapa" className="block">
          <LiveMap markers={markers} />
        </Link>

        <LiveCrew members={crew} compact />

        {open.length > 0 ? (
          <section className="rounded-xl border border-ok/25 bg-surface p-3 shadow-card">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ok">Em andamento · save global</p>
            <div className="flex flex-col gap-2">
              {open.map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-lg bg-ok-fg px-3 py-2">
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => void navigate({ to: "/novo", search: { edit: a.id } })}
                  >
                    <p className="truncate text-sm font-semibold text-fg">{a.equipmentName}</p>
                    <p className="truncate text-xs text-ok">
                      {a.activityName} · desde {a.start}
                      {a.streetName ? ` · ${a.streetName}` : ""}
                    </p>
                  </button>
                  <Button
                    size="sm"
                    onClick={() => {
                      closeMut.mutate({ id: a.id, end: nowHHMM() });
                      toast.success("Atividade encerrada");
                    }}
                  >
                    <Square className="size-3.5 fill-current" />
                    Encerrar
                  </Button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">
              A mesma atividade fica aberta para toda a equipe até alguém encerrar. Salvar de novo não cria outra.
            </p>
          </section>
        ) : null}

        <Link
          to="/novo"
          className="flex min-h-16 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-lg font-semibold text-primary-fg shadow-card"
        >
          <Plus className="size-5" />
          {myOpen ? "Atualizar atividade" : "Nova atividade"}
        </Link>

        <section>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold">Do dia</h2>
            <p className="text-sm tabular-nums text-muted">
              {rows.length} · {formatDuration(hours)}
            </p>
          </div>
          {rows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center">
              <Clock className="mx-auto mb-2 size-6 text-subtle" />
              <p className="text-sm text-muted">
                Nenhuma atividade ainda. Toque em Nova atividade, preencha e conclua — nada é criado sozinho.
              </p>
            </div>
          ) : (
            <ol className="flex flex-col gap-2">
              {rows.map((a) => (
                <li key={a.id}>
                  <Link
                    to="/novo"
                    search={{ edit: a.id }}
                    className="block rounded-xl border border-border bg-surface p-3 shadow-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-mono text-sm tabular-nums text-muted">
                        {a.start}
                        {a.end ? `–${a.end}` : "–…"}
                      </p>
                      {!a.end ? (
                        <span className="rounded-full bg-ok-fg px-2 py-0.5 text-[11px] font-medium text-ok">
                          andamento
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm font-semibold">{a.equipmentName}</p>
                    <p className="text-sm text-muted">
                      {a.activityName}
                      {a.streetName ? ` · ${a.streetName}` : ""}
                      {a.estaca ? ` · E ${a.estaca}` : ""}
                      {a.pv ? ` · ${a.pv}` : ""}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </section>

        {work ? (
          <p className="text-center text-xs text-subtle">
            {work.code} · {work.name} · compartilhado com a equipe
          </p>
        ) : null}
      </main>
    </AppShell>
  );
}
