import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { GpsBanner } from "@/components/gps-banner";
import { LiveCrew } from "@/components/live-crew";
import { collectMarkers, LiveMap } from "@/components/live-map";
import { ScreenLoader } from "@/components/screen-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSnapshot } from "@/lib/api";
import { buildCrew } from "@/lib/crew";
import { getCrewLabel, getDeviceId, loadLast, setCrewLabel, useGps } from "@/lib/geo";
import { useLivePresence, usePresencePing, useSnapshot } from "@/lib/use-snapshot";
import { todayISO } from "@/lib/utils";

export const Route = createFileRoute("/mapa")({
  loader: () => getSnapshot(),
  staleTime: 12_000,
  component: Mapa,
});

function Mapa() {
  const initial = Route.useLoaderData();
  const { data, isLoading } = useSnapshot(initial, true);
  const gps = useGps();
  const last = loadLast();
  const [label, setLabel] = useState(() => (typeof window === "undefined" ? "" : getCrewLabel()));
  const { data: livePresence } = useLivePresence(true, initial.presence);

  const today = todayISO();
  const rows = useMemo(
    () => (data?.apontamentos ?? []).filter((a) => a.date === today || !a.end),
    [data?.apontamentos, today],
  );
  const open = (data?.apontamentos ?? []).filter((a) => !a.end);
  const myOpen = open.find((a) => a.equipmentId === last.equipmentId) ?? open[0];
  const presence = livePresence ?? data?.presence ?? [];
  const gpsLat = gps.status === "ready" ? gps.lat : null;
  const gpsLng = gps.status === "ready" ? gps.lng : null;
  const gpsAcc = gps.status === "ready" ? gps.accuracy : null;
  const deviceId = typeof window === "undefined" ? "" : getDeviceId();

  usePresencePing(gps, {
    ...last,
    apontamentoId: myOpen?.id ?? null,
    activityId: myOpen?.activityId || last.activityId,
    equipmentId: myOpen?.equipmentId || last.equipmentId,
    streetId: myOpen?.streetId || last.streetId,
    workId: myOpen?.workId || last.workId,
  });

  const markers = useMemo(
    () =>
      collectMarkers({
        gps,
        presence,
        apontamentos: rows,
        deviceId,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gpsLat, gpsLng, gpsAcc, presence, rows, deviceId],
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
        <h1 className="font-display text-2xl font-semibold">Mapa da frente</h1>
        <p className="text-sm text-muted">Equipe ao vivo, GPS e máquinas com atividade aberta.</p>
      </header>
      <main className="flex flex-col gap-4 px-4 pb-6">
        <GpsBanner gps={gps} />
        <LiveMap markers={markers} heightClass="h-72" />

        <section className="rounded-xl border border-border bg-surface p-3 shadow-card">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Seu nome no mapa</p>
          <div className="flex gap-2">
            <Input value={label} maxLength={24} onChange={(e) => setLabel(e.target.value)} placeholder="Frente 1" />
            <Button
              variant="outline"
              onClick={() => {
                setCrewLabel(label);
              }}
            >
              Salvar
            </Button>
          </div>
        </section>

        <LiveCrew members={crew} />

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">Pontos de hoje</h2>
          {rows.filter((a) => a.lat != null).length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-muted">
              Ainda não há pontos. Quando uma atividade for aberta com GPS, aparece aqui.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {rows
                .filter((a) => a.lat != null)
                .map((a) => (
                  <li key={a.id}>
                    <Link
                      to="/novo"
                      search={{ edit: a.id }}
                      className="block rounded-xl border border-border bg-surface p-3"
                    >
                      <p className="text-sm font-semibold">{a.equipmentName}</p>
                      <p className="text-xs text-muted">
                        {a.activityName} · {a.streetName}
                        {a.end ? "" : " · em andamento"}
                        {a.locationLabel ? ` · ${a.locationLabel}` : ""}
                      </p>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </section>
      </main>
    </AppShell>
  );
}
