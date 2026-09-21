import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { l as todayISO } from "./utils-C8V_sHGQ.mjs";
import { i as Route$2 } from "./router-BVQcZgbY.mjs";
import { C as useSnapshot, S as usePresencePing, c as getCrewLabel, f as loadLast, g as setCrewLabel, i as Input, l as getDeviceId, n as Button, o as ScreenLoader, t as AppShell, x as useLivePresence, y as useGps } from "./use-snapshot-2ITqXV0M.mjs";
import { n as buildCrew, t as GpsBanner } from "./crew-CqZ6wVE2.mjs";
import { n as LiveMap, r as collectMarkers, t as LiveCrew } from "./live-map-BPVWw31_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mapa-BW2Iskgr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Mapa() {
	const initial = Route$2.useLoaderData();
	const { data, isLoading } = useSnapshot(initial, true);
	const gps = useGps();
	const last = loadLast();
	const [label, setLabel] = (0, import_react.useState)(() => typeof window === "undefined" ? "" : getCrewLabel());
	const { data: livePresence } = useLivePresence(true, initial.presence);
	const today = todayISO();
	const rows = (0, import_react.useMemo)(() => (data?.apontamentos ?? []).filter((a) => a.date === today || !a.end), [data?.apontamentos, today]);
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
		workId: myOpen?.workId || last.workId
	});
	const markers = (0, import_react.useMemo)(() => collectMarkers({
		gps,
		presence,
		apontamentos: rows,
		deviceId
	}), [
		gpsLat,
		gpsLng,
		gpsAcc,
		presence,
		rows,
		deviceId
	]);
	const crew = (0, import_react.useMemo)(() => buildCrew({
		presence,
		apontamentos: data?.apontamentos ?? [],
		deviceId,
		gps,
		equipment: data?.equipment ?? [],
		activities: data?.activities ?? [],
		streets: data?.streets ?? [],
		works: data?.works ?? []
	}), [
		presence,
		data?.apontamentos,
		data?.equipment,
		data?.activities,
		data?.streets,
		data?.works,
		deviceId,
		gpsLat,
		gpsLng
	]);
	if (isLoading && !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenLoader, {}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "px-4 pb-3 pt-[max(16px,env(safe-area-inset-top))]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-semibold",
			children: "Mapa da frente"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Equipe ao vivo, GPS e máquinas com atividade aberta."
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-col gap-4 px-4 pb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GpsBanner, { gps }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveMap, {
				markers,
				heightClass: "h-72"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-3 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium uppercase tracking-wide text-muted",
					children: "Seu nome no mapa"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: label,
						maxLength: 24,
						onChange: (e) => setLabel(e.target.value),
						placeholder: "Frente 1"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							setCrewLabel(label);
						},
						children: "Salvar"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveCrew, { members: crew }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 font-display text-lg font-semibold",
				children: "Pontos de hoje"
			}), rows.filter((a) => a.lat != null).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-muted",
				children: "Ainda não há pontos. Quando uma atividade for aberta com GPS, aparece aqui."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: rows.filter((a) => a.lat != null).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/novo",
					search: { edit: a.id },
					className: "block rounded-xl border border-border bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: a.equipmentName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							a.activityName,
							" · ",
							a.streetName,
							a.end ? "" : " · em andamento",
							a.locationLabel ? ` · ${a.locationLabel}` : ""
						]
					})]
				}) }, a.id))
			})] })
		]
	})] });
}
//#endregion
export { Mapa as component };
