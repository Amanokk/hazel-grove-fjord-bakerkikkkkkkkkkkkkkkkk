import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { c as relativeTime, n as formatAccuracy, t as cn } from "./utils-C8V_sHGQ.mjs";
import { c as Radio, d as Navigation, p as MapPin, t as Users } from "../_libs/lucide-react.mjs";
import { d as haversineMeters, m as projectMercator, r as DEFAULT_CENTER } from "./use-snapshot-2ITqXV0M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-map-BPVWw31_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LiveCrew({ members, compact = false }) {
	const others = members.filter((m) => !m.isSelf);
	const online = members.filter((m) => m.online).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-3 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative flex size-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex size-full animate-live-dot rounded-full bg-ok" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex size-2.5 rounded-full bg-ok" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-base font-semibold",
						children: "Equipe ao vivo"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs tabular-nums text-muted",
					children: [
						online,
						" no campo · ",
						members.length
					]
				})]
			}),
			members.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-1 px-3 py-6 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Ninguém no mapa ainda. Ative o GPS e ponha um apelido."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrewRow, {
					member: m,
					compact
				}, m.id))
			}),
			compact && others.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/mapa",
				className: "mt-2 block text-center text-xs font-medium text-primary",
				children: "Ver no mapa"
			}) : null
		]
	});
}
function CrewRow({ member: m, compact }) {
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-2",
		children: m.online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4 text-ok" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-muted" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 flex-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-semibold",
					children: m.isSelf ? `${m.label} (você)` : m.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { member: m })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "truncate text-xs text-muted",
				children: [m.equipmentName || "Sem máquina", m.activityName ? ` · ${m.activityName}` : " · sem atividade aberta"]
			}),
			compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "truncate text-xs text-subtle",
				children: [
					m.streetName || m.workName || "Posição GPS",
					m.distanceM != null ? ` · ${formatAccuracy(m.distanceM)}` : "",
					m.updatedAt ? ` · ${relativeTime(m.updatedAt)}` : ""
				]
			})
		]
	})] });
	if (m.apontamentoId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/novo",
		search: { edit: m.apontamentoId },
		className: "flex items-start gap-3 rounded-lg bg-surface-2 px-3 py-2",
		children: inner
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: "flex items-start gap-3 rounded-lg bg-surface-2 px-3 py-2",
		children: inner
	});
}
function StatusPill({ member: m }) {
	const label = m.online ? "ao vivo" : m.stale ? "há pouco" : m.apontamentoId ? "andamento" : "offline";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", m.online ? "bg-ok-fg text-ok" : m.apontamentoId ? "bg-ok-fg/70 text-ok" : "bg-surface text-muted"),
		children: label
	});
}
function collectMarkers(opts) {
	const markers = [];
	const coveredOpen = /* @__PURE__ */ new Set();
	if (opts.gps.status === "ready") markers.push({
		id: "me",
		lat: opts.gps.lat,
		lng: opts.gps.lng,
		kind: "me",
		label: "Você",
		accuracy: opts.gps.accuracy
	});
	for (const p of opts.presence) {
		if (p.deviceId === opts.deviceId) continue;
		const a = opts.apontamentos.find((x) => !x.end && (x.id === p.apontamentoId || x.equipmentId === p.equipmentId || x.deviceId === p.deviceId));
		if (a) coveredOpen.add(a.id);
		markers.push({
			id: `p-${p.deviceId}`,
			lat: p.lat,
			lng: p.lng,
			kind: "crew",
			label: a ? `${p.label || "Equipe"} · ${a.equipmentName}` : p.label || "Equipe",
			accuracy: p.accuracy ?? void 0
		});
	}
	for (const a of opts.apontamentos) {
		if (a.lat == null || a.lng == null) continue;
		if (!a.end && coveredOpen.has(a.id)) continue;
		markers.push({
			id: `a-${a.id}`,
			lat: a.lat,
			lng: a.lng,
			kind: a.end ? "done" : "open",
			label: a.equipmentName
		});
	}
	return markers;
}
function LiveMap({ markers, className, heightClass = "h-52" }) {
	const ref = (0, import_react.useRef)(null);
	const centerRef = (0, import_react.useRef)(DEFAULT_CENTER);
	const [size, setSize] = (0, import_react.useState)({
		w: 360,
		h: 208
	});
	const zoom = markers.length > 4 ? 15 : 16;
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const sync = () => setSize({
			w: el.clientWidth,
			h: el.clientHeight
		});
		sync();
		const ro = new ResizeObserver(sync);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);
	const center = (0, import_react.useMemo)(() => {
		let target = DEFAULT_CENTER;
		if (markers.length > 0) {
			const me = markers.find((m) => m.kind === "me");
			if (me) target = {
				lat: me.lat,
				lng: me.lng
			};
			else target = {
				lat: markers.reduce((s, m) => s + m.lat, 0) / markers.length,
				lng: markers.reduce((s, m) => s + m.lng, 0) / markers.length
			};
		}
		if (haversineMeters(centerRef.current, target) < 14) return centerRef.current;
		centerRef.current = target;
		return target;
	}, [markers]);
	const layout = (0, import_react.useMemo)(() => {
		const TILE = 256;
		const c = projectMercator(center.lat, center.lng, zoom);
		const cx = c.x * TILE;
		const cy = c.y * TILE;
		const x0 = Math.floor((cx - size.w / 2) / TILE);
		const y0 = Math.floor((cy - size.h / 2) / TILE);
		const x1 = Math.floor((cx + size.w / 2) / TILE);
		const y1 = Math.floor((cy + size.h / 2) / TILE);
		const tiles = [];
		const n = 2 ** zoom;
		for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
			const tx = (x % n + n) % n;
			tiles.push({
				x: tx,
				y,
				left: x * TILE - (cx - size.w / 2),
				top: y * TILE - (cy - size.h / 2)
			});
		}
		const metersPerPx = 156543.03392 * Math.cos(center.lat * Math.PI / 180) / 2 ** zoom;
		return {
			tiles,
			points: markers.map((m) => {
				const p = projectMercator(m.lat, m.lng, zoom);
				return {
					...m,
					left: p.x * TILE - (cx - size.w / 2),
					top: p.y * TILE - (cy - size.h / 2),
					radius: m.accuracy && metersPerPx > 0 ? m.accuracy / metersPerPx : 0
				};
			})
		};
	}, [
		center.lat,
		center.lng,
		markers,
		size.h,
		size.w,
		zoom
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("relative overflow-hidden rounded-xl bg-surface-2 shadow-card", heightClass, className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0",
				children: layout.tiles.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					alt: "",
					width: 256,
					height: 256,
					className: "pointer-events-none absolute max-w-none",
					style: {
						left: t.left,
						top: t.top
					},
					src: `https://tile.openstreetmap.org/${zoom}/${t.x}/${t.y}.png`,
					crossOrigin: "anonymous"
				}, `${zoom}-${t.x}-${t.y}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/35 to-transparent" }),
			layout.points.map((m) => m.kind === "me" && m.radius > 8 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute z-10 rounded-full bg-primary/20",
				style: {
					left: m.left - m.radius,
					top: m.top - m.radius,
					width: m.radius * 2,
					height: m.radius * 2
				}
			}, `${m.id}-acc`) : null),
			layout.points.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute z-10 -translate-x-1/2 -translate-y-full",
				style: {
					left: m.left,
					top: m.top
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("mb-0.5 max-w-28 truncate rounded-full px-1.5 py-0.5 text-[10px] font-semibold shadow-card", m.kind === "me" ? "bg-primary text-primary-fg" : m.kind === "crew" ? "bg-fg text-bg" : m.kind === "open" ? "bg-ok text-ok-fg" : "bg-surface text-fg"),
						children: m.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("block size-3 rounded-full border-2 border-surface", m.kind === "me" ? "bg-primary" : m.kind === "crew" ? "bg-fg" : m.kind === "open" ? "bg-ok" : "bg-muted") })]
				})
			}, m.id)),
			markers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-surface/70 px-4 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-5 text-muted" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-fg",
						children: "Aguardando GPS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Ative a localização para ver a equipe no mapa."
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-2 left-2 z-10 flex items-center gap-1 rounded-full bg-surface/90 px-2 py-1 text-[10px] text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "size-3" }), "OpenStreetMap"]
			})
		]
	});
}
//#endregion
export { LiveMap as n, collectMarkers as r, LiveCrew as t };
