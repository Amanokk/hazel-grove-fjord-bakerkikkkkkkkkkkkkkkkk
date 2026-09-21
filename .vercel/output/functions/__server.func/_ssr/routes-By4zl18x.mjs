import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatDuration, l as todayISO, o as minutesBetween, r as formatDateBR, s as nowHHMM } from "./utils-C8V_sHGQ.mjs";
import { b as Clock, i as Square, u as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as Route$5 } from "./router-BVQcZgbY.mjs";
import { C as useSnapshot, S as usePresencePing, _ as useCloseApontamento, c as getCrewLabel, f as loadLast, g as setCrewLabel, h as saveLast, i as Input, l as getDeviceId, n as Button, o as ScreenLoader, t as AppShell, x as useLivePresence, y as useGps } from "./use-snapshot-2ITqXV0M.mjs";
import { n as buildCrew, t as GpsBanner } from "./crew-CqZ6wVE2.mjs";
import { n as LiveMap, r as collectMarkers, t as LiveCrew } from "./live-map-BPVWw31_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-By4zl18x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const navigate = useNavigate();
	const initial = Route$5.useLoaderData();
	const { data, isLoading } = useSnapshot(initial, true);
	const gps = useGps();
	const closeMut = useCloseApontamento();
	const { data: livePresence } = useLivePresence(true, initial.presence);
	const [tick, setTick] = (0, import_react.useState)(nowHHMM());
	const [last, setLast] = (0, import_react.useState)(loadLast);
	const [label, setLabel] = (0, import_react.useState)("");
	const [labelOpen, setLabelOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setTick(nowHHMM()), 3e4);
		return () => clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		setLabel(getCrewLabel());
		setLabelOpen(!getCrewLabel());
	}, []);
	const today = todayISO();
	const rows = (0, import_react.useMemo)(() => (data?.apontamentos ?? []).filter((a) => a.date === today).sort((a, b) => a.start.localeCompare(b.start) || a.createdAt.localeCompare(b.createdAt)), [data?.apontamentos, today]);
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
		workId: myOpen?.workId || last.workId
	});
	const hours = rows.reduce((acc, a) => acc + minutesBetween(a.start, a.end ?? tick), 0);
	const markers = (0, import_react.useMemo)(() => collectMarkers({
		gps,
		presence,
		apontamentos: [...open, ...rows.filter((a) => a.end)],
		deviceId
	}), [
		gpsLat,
		gpsLng,
		gpsAcc,
		presence,
		open,
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
	function setWork(workId) {
		const next = {
			...last,
			workId
		};
		const first = data?.streets.find((s) => s.active && s.workId === workId);
		if (first) next.streetId = first.id;
		setLast(next);
		saveLast(next);
	}
	if (isLoading && !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenLoader, {}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "px-4 pb-3 pt-[max(16px,env(safe-area-inset-top))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
				children: "Apontador"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold leading-none text-fg",
					children: formatDateBR(today)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm tabular-nums text-muted",
					children: tick
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-2 overflow-x-auto",
				children: (data?.works ?? []).filter((w) => w.active).map((w) => {
					const on = w.id === last.workId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setWork(w.id),
						className: on ? "h-9 shrink-0 rounded-full bg-primary px-3 text-sm font-medium text-primary-fg" : "h-9 shrink-0 rounded-full border border-border bg-surface px-3 text-sm text-fg",
						children: [
							w.code,
							" ",
							w.name
						]
					}, w.id);
				})
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col gap-4 px-4 pb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GpsBanner, { gps }),
			labelOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-3 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Como a equipe te acha no mapa?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs text-muted",
						children: "Apelido da frente, código da máquina ou “Equipe 1”."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: label,
							maxLength: 24,
							onChange: (e) => setLabel(e.target.value),
							placeholder: "Ex.: Frente 1"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								setCrewLabel(label);
								setLabelOpen(false);
							},
							children: "Ok"
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/mapa",
				className: "block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveMap, { markers })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveCrew, {
				members: crew,
				compact: true
			}),
			open.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-ok/25 bg-surface p-3 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium uppercase tracking-wide text-ok",
						children: "Em andamento · save global"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-2",
						children: open.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-lg bg-ok-fg px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "min-w-0 flex-1 text-left",
								onClick: () => void navigate({
									to: "/novo",
									search: { edit: a.id }
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold text-fg",
									children: a.equipmentName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-ok",
									children: [
										a.activityName,
										" · desde ",
										a.start,
										a.streetName ? ` · ${a.streetName}` : ""
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => {
									closeMut.mutate({
										id: a.id,
										end: nowHHMM()
									});
									toast.success("Atividade encerrada");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5 fill-current" }), "Encerrar"]
							})]
						}, a.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: "A mesma atividade fica aberta para toda a equipe até alguém encerrar. Salvar de novo não cria outra."
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/novo",
				className: "flex min-h-16 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-lg font-semibold text-primary-fg shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" }), myOpen ? "Atualizar atividade" : "Nova atividade"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Do dia"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm tabular-nums text-muted",
					children: [
						rows.length,
						" · ",
						formatDuration(hours)
					]
				})]
			}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mx-auto mb-2 size-6 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Nenhuma atividade ainda. Toque em Nova atividade, preencha e conclua — nada é criado sozinho."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-col gap-2",
				children: rows.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/novo",
					search: { edit: a.id },
					className: "block rounded-xl border border-border bg-surface p-3 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-sm tabular-nums text-muted",
								children: [a.start, a.end ? `–${a.end}` : "–…"]
							}), !a.end ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-ok-fg px-2 py-0.5 text-[11px] font-medium text-ok",
								children: "andamento"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm font-semibold",
							children: a.equipmentName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								a.activityName,
								a.streetName ? ` · ${a.streetName}` : "",
								a.estaca ? ` · E ${a.estaca}` : "",
								a.pv ? ` · ${a.pv}` : ""
							]
						})
					]
				}) }, a.id))
			})] }),
			work ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-center text-xs text-subtle",
				children: [
					work.code,
					" · ",
					work.name,
					" · compartilhado com a equipe"
				]
			}) : null
		]
	})] });
}
//#endregion
export { Home as component };
