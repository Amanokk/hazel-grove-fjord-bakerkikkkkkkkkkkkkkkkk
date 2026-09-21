import type { Activity, Apontamento, Equipment, GpsState, Presence, Street, Work } from "./types";
import { haversineMeters } from "./geo";

export type CrewMember = {
  id: string;
  isSelf: boolean;
  online: boolean;
  stale: boolean;
  label: string;
  equipmentId: string | null;
  equipmentName: string;
  activityName: string;
  streetName: string;
  workName: string;
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  updatedAt: string;
  apontamentoId: string | null;
  distanceM: number | null;
};

const ONLINE_MS = 45_000;
const STALE_MS = 8 * 60_000;

function nameOf(list: { id: string; name: string }[], id: string | null | undefined): string {
  if (!id) return "";
  return list.find((x) => x.id === id)?.name ?? "";
}

export function buildCrew(opts: {
  presence: Presence[];
  apontamentos: Apontamento[];
  deviceId: string;
  gps: GpsState;
  equipment: Equipment[];
  activities: Activity[];
  streets: Street[];
  works: Work[];
  now?: number;
}): CrewMember[] {
  const now = opts.now ?? Date.now();
  const open = opts.apontamentos.filter((a) => !a.end);
  const usedOpen = new Set<string>();
  const members: CrewMember[] = [];
  const selfGps = opts.gps.status === "ready" ? opts.gps : null;

  const openByDevice = new Map<string, Apontamento>();
  const openByEq = new Map<string, Apontamento>();
  for (const a of open) {
    if (a.deviceId) openByDevice.set(a.deviceId, a);
    openByEq.set(a.equipmentId, a);
  }

  function attach(p: Presence, forceSelf: boolean): CrewMember {
    const a =
      (p.apontamentoId ? open.find((x) => x.id === p.apontamentoId) : undefined) ??
      openByDevice.get(p.deviceId) ??
      (p.equipmentId ? openByEq.get(p.equipmentId) : undefined);
    if (a) usedOpen.add(a.id);
    const age = now - new Date(p.updatedAt).getTime();
    const online = Number.isFinite(age) && age <= ONLINE_MS;
    const stale = !online && Number.isFinite(age) && age <= STALE_MS;
    const lat = p.lat;
    const lng = p.lng;
    return {
      id: p.deviceId,
      isSelf: forceSelf || p.deviceId === opts.deviceId,
      online,
      stale,
      label: p.label || (forceSelf ? "Você" : "No campo"),
      equipmentId: a?.equipmentId ?? p.equipmentId,
      equipmentName: a?.equipmentName || nameOf(opts.equipment, p.equipmentId),
      activityName: a?.activityName || nameOf(opts.activities, p.activityId),
      streetName: a?.streetName || nameOf(opts.streets, p.streetId),
      workName: a?.workName || nameOf(opts.works, p.workId),
      lat,
      lng,
      accuracy: p.accuracy,
      updatedAt: p.updatedAt,
      apontamentoId: a?.id ?? p.apontamentoId,
      distanceM:
        selfGps && p.deviceId !== opts.deviceId ? haversineMeters(selfGps, { lat, lng }) : null,
    };
  }

  const seen = new Set<string>();
  for (const p of opts.presence) {
    seen.add(p.deviceId);
    members.push(attach(p, p.deviceId === opts.deviceId));
  }

  if (selfGps && !seen.has(opts.deviceId)) {
    members.push(
      attach(
        {
          deviceId: opts.deviceId,
          label: "Você",
          lat: selfGps.lat,
          lng: selfGps.lng,
          accuracy: selfGps.accuracy,
          workId: null,
          equipmentId: null,
          streetId: null,
          activityId: null,
          apontamentoId: null,
          updatedAt: new Date(selfGps.updatedAt).toISOString(),
        },
        true,
      ),
    );
  }

  for (const a of open) {
    if (usedOpen.has(a.id)) continue;
    if (a.deviceId && seen.has(a.deviceId)) continue;
    const id = a.deviceId || `apt-${a.id}`;
    const hasGeo = a.lat != null && a.lng != null;
    members.push({
      id,
      isSelf: a.deviceId === opts.deviceId,
      online: false,
      stale: true,
      label: a.equipmentName,
      equipmentId: a.equipmentId,
      equipmentName: a.equipmentName,
      activityName: a.activityName,
      streetName: a.streetName,
      workName: a.workName,
      lat: a.lat,
      lng: a.lng,
      accuracy: a.accuracy,
      updatedAt: a.updatedAt,
      apontamentoId: a.id,
      distanceM: selfGps && hasGeo ? haversineMeters(selfGps, { lat: a.lat!, lng: a.lng! }) : null,
    });
  }

  return members.sort((a, b) => {
    if (a.isSelf !== b.isSelf) return a.isSelf ? -1 : 1;
    if (a.online !== b.online) return a.online ? -1 : 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

export function openForEquipment(rows: Apontamento[], equipmentId: string): Apontamento | undefined {
  if (!equipmentId) return undefined;
  return rows.find((a) => !a.end && a.equipmentId === equipmentId);
}
