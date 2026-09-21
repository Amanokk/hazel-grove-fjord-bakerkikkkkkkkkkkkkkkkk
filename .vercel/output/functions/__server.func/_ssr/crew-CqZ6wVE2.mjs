import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as formatAccuracy } from "./utils-C8V_sHGQ.mjs";
import { g as LoaderCircle, h as LocateFixed, m as LocateOff } from "../_libs/lucide-react.mjs";
import { _ as reverseGeocode } from "./router-BVQcZgbY.mjs";
import { d as haversineMeters, n as Button, u as gpsQualityLabel } from "./use-snapshot-2ITqXV0M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crew-CqZ6wVE2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var cache = /* @__PURE__ */ new Map();
var inflight = /* @__PURE__ */ new Map();
function placeKey(lat, lng) {
	return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}
function lookupPlace(lat, lng) {
	const key = placeKey(lat, lng);
	const hit = cache.get(key);
	if (hit) return Promise.resolve(hit);
	let pending = inflight.get(key);
	if (!pending) {
		pending = reverseGeocode({ data: {
			lat,
			lng
		} }).then((r) => {
			cache.set(key, r);
			inflight.delete(key);
			return r;
		}).catch(() => {
			inflight.delete(key);
			return {
				label: "",
				road: "",
				city: ""
			};
		});
		inflight.set(key, pending);
	}
	return pending;
}
function usePlaceLabel(lat, lng) {
	const [place, setPlace] = (0, import_react.useState)({
		label: "",
		road: "",
		city: ""
	});
	(0, import_react.useEffect)(() => {
		if (lat == null || lng == null) return;
		let cancelled = false;
		lookupPlace(lat, lng).then((r) => {
			if (!cancelled) setPlace(r);
		});
		return () => {
			cancelled = true;
		};
	}, [lat, lng]);
	return place;
}
function GpsBanner({ gps, onRetry }) {
	const place = usePlaceLabel(gps.status === "ready" ? gps.lat : null, gps.status === "ready" ? gps.lng : null);
	if (gps.status === "ready") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 rounded-xl bg-ok-fg px-3 py-2 text-ok",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-sm font-semibold leading-tight",
				children: place.label || "Localização ativa"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] tabular-nums opacity-80",
				children: [
					gpsQualityLabel(gps.quality),
					" · ±",
					formatAccuracy(gps.accuracy)
				]
			})]
		})]
	});
	if (gps.status === "requesting" || gps.status === "idle") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 shrink-0 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: "Ativando GPS… fique ao ar livre para melhor precisão."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateOff, { className: "size-4 shrink-0 text-danger" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "min-w-0 flex-1 text-sm text-muted",
				children: gps.message ?? "GPS desligado. Toque para ativar."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: onRetry ?? gps.retry,
				children: "Ativar"
			})
		]
	});
}
var ONLINE_MS = 45e3;
var STALE_MS = 48e4;
function nameOf(list, id) {
	if (!id) return "";
	return list.find((x) => x.id === id)?.name ?? "";
}
function buildCrew(opts) {
	const now = opts.now ?? Date.now();
	const open = opts.apontamentos.filter((a) => !a.end);
	const usedOpen = /* @__PURE__ */ new Set();
	const members = [];
	const selfGps = opts.gps.status === "ready" ? opts.gps : null;
	const openByDevice = /* @__PURE__ */ new Map();
	const openByEq = /* @__PURE__ */ new Map();
	for (const a of open) {
		if (a.deviceId) openByDevice.set(a.deviceId, a);
		openByEq.set(a.equipmentId, a);
	}
	function attach(p, forceSelf) {
		const a = (p.apontamentoId ? open.find((x) => x.id === p.apontamentoId) : void 0) ?? openByDevice.get(p.deviceId) ?? (p.equipmentId ? openByEq.get(p.equipmentId) : void 0);
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
			distanceM: selfGps && p.deviceId !== opts.deviceId ? haversineMeters(selfGps, {
				lat,
				lng
			}) : null
		};
	}
	const seen = /* @__PURE__ */ new Set();
	for (const p of opts.presence) {
		seen.add(p.deviceId);
		members.push(attach(p, p.deviceId === opts.deviceId));
	}
	if (selfGps && !seen.has(opts.deviceId)) members.push(attach({
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
		updatedAt: new Date(selfGps.updatedAt).toISOString()
	}, true));
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
			distanceM: selfGps && hasGeo ? haversineMeters(selfGps, {
				lat: a.lat,
				lng: a.lng
			}) : null
		});
	}
	return members.sort((a, b) => {
		if (a.isSelf !== b.isSelf) return a.isSelf ? -1 : 1;
		if (a.online !== b.online) return a.online ? -1 : 1;
		return b.updatedAt.localeCompare(a.updatedAt);
	});
}
function openForEquipment(rows, equipmentId) {
	if (!equipmentId) return void 0;
	return rows.find((a) => !a.end && a.equipmentId === equipmentId);
}
//#endregion
export { usePlaceLabel as i, buildCrew as n, openForEquipment as r, GpsBanner as t };
