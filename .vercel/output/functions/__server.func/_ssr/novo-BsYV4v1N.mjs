import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as PV_PREFIXES, i as NOTE_CHIPS, o as QUANTITY_LABEL, r as KIND_LABEL } from "./catalog-Dpw3AA8E.mjs";
import { l as todayISO, s as nowHHMM, t as cn, u as uid } from "./utils-C8V_sHGQ.mjs";
import { t as buildDescription } from "./description-g2nIFaeH.mjs";
import { C as Check, S as ChevronDown, T as ArrowLeft, g as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as addActivity, r as Route$1 } from "./router-BVQcZgbY.mjs";
import { C as useSnapshot, S as usePresencePing, _ as useCloseApontamento, a as Label, b as useInvalidateSnapshot, f as loadLast, h as saveLast, i as Input, l as getDeviceId, n as Button, o as ScreenLoader, p as matchStreetByLabel, s as Textarea, t as AppShell, w as useUpsertApontamento, y as useGps } from "./use-snapshot-2ITqXV0M.mjs";
import { n as ChoiceList, t as ChipRow } from "./choice-DtEvLaaF.mjs";
import { i as usePlaceLabel, r as openForEquipment, t as GpsBanner } from "./crew-CqZ6wVE2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/novo-BsYV4v1N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ApontamentoForm({ draft, onChange, onSubmit, submitLabel = "Salvar", works, streets, equipment, activities, gps, locationLabel, saveState, onAddActivity, openHint, onEncerrar }) {
	const [qEq, setQEq] = (0, import_react.useState)("");
	const [qSt, setQSt] = (0, import_react.useState)("");
	const [qAct, setQAct] = (0, import_react.useState)("");
	const [customAct, setCustomAct] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)("eq");
	const eq = equipment.find((e) => e.id === draft.equipmentId);
	const act = activities.find((a) => a.id === draft.activityId);
	const street = streets.find((s) => s.id === draft.streetId);
	const work = works.find((w) => w.id === draft.workId);
	(0, import_react.useEffect)(() => {
		if (!draft.equipmentId) setOpen("eq");
		else if (!draft.activityId) setOpen("act");
		else if (!draft.streetId) setOpen("rua");
	}, [
		draft.equipmentId,
		draft.activityId,
		draft.streetId
	]);
	const streetOpts = (0, import_react.useMemo)(() => {
		const list = streets.filter((s) => s.active && (!draft.workId || s.workId === draft.workId));
		const q = qSt.trim().toLowerCase();
		return (q ? list.filter((s) => s.name.toLowerCase().includes(q)) : list).map((s) => ({
			id: s.id,
			label: s.name
		}));
	}, [
		streets,
		draft.workId,
		qSt
	]);
	const eqOpts = (0, import_react.useMemo)(() => {
		const list = equipment.filter((e) => e.active);
		const q = qEq.trim().toLowerCase();
		return (q ? list.filter((e) => `${e.name} ${e.code}`.toLowerCase().includes(q)) : list).map((e) => ({
			id: e.id,
			label: e.name,
			hint: KIND_LABEL[e.kind]
		}));
	}, [equipment, qEq]);
	const actOpts = (0, import_react.useMemo)(() => {
		const ids = new Set(eq?.activityIds ?? []);
		const list = activities.filter((a) => ids.has(a.id));
		const servico = list.filter((a) => a.kind === "servico");
		const other = list.filter((a) => a.kind !== "servico");
		const ordered = [...servico, ...other];
		const q = qAct.trim().toLowerCase();
		return (q ? ordered.filter((a) => a.name.toLowerCase().includes(q)) : ordered).map((a) => ({
			id: a.id,
			label: a.name,
			hint: a.kind === "status" ? "Status" : void 0
		}));
	}, [
		activities,
		eq,
		qAct
	]);
	const preview = buildDescription({
		equipmentName: eq?.name ?? "",
		activityName: act?.name ?? "",
		streetName: street?.name ?? "",
		estaca: draft.estaca,
		pv: draft.pv
	});
	const qtyLabel = eq ? QUANTITY_LABEL[eq.kind] : void 0;
	const canSave = Boolean(draft.equipmentId && draft.activityId && draft.streetId && draft.start);
	function set(patch) {
		onChange({
			...draft,
			...patch
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3 pb-28",
		children: [
			openHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-ok/30 bg-ok-fg px-4 py-3 text-sm text-ok",
				children: "Esta máquina já tem uma atividade em andamento. Salvar atualiza o mesmo registro para toda a equipe. Ela só termina quando você tocar em Encerrar."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Nada é criado sozinho. A atividade só entra no diário quando você tocar em Concluir, e fica aberta até Encerrar."
			}),
			preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
				className: "rounded-xl border border-border bg-surface p-4 text-[15px] leading-snug text-fg shadow-card",
				children: preview
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
				n: 1,
				title: "Obra",
				summary: work ? `${work.code} · ${work.name}` : void 0,
				open: open === "obra",
				onToggle: () => setOpen(open === "obra" ? "eq" : "obra"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceList, {
					options: works.filter((w) => w.active).map((w) => ({
						id: w.id,
						label: `${w.code} · ${w.name}`
					})),
					value: draft.workId,
					onChange: (id) => {
						set({
							workId: id,
							streetId: streets.find((s) => s.active && s.workId === id)?.id ?? draft.streetId
						});
						setOpen("eq");
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
				n: 2,
				title: "Máquina",
				summary: eq?.name,
				open: open === "eq",
				onToggle: () => setOpen(open === "eq" ? "act" : "eq"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: qEq,
					onChange: (e) => setQEq(e.target.value),
					placeholder: "Filtrar equipamento…",
					className: "mb-2"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceList, {
					options: eqOpts,
					value: draft.equipmentId,
					onChange: (id) => {
						const keep = equipment.find((e) => e.id === id)?.activityIds.includes(draft.activityId);
						set({
							equipmentId: id,
							activityId: keep ? draft.activityId : ""
						});
						setOpen("act");
					}
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
				n: 3,
				title: "O que está fazendo",
				summary: act?.name,
				open: open === "act",
				onToggle: () => setOpen(open === "act" ? "rua" : "act"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: qAct,
						onChange: (e) => setQAct(e.target.value),
						placeholder: "Filtrar atividade…",
						className: "mb-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceList, {
						options: actOpts,
						value: draft.activityId,
						onChange: (id) => {
							set({ activityId: id });
							setOpen("rua");
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: customAct,
							onChange: (e) => setCustomAct(e.target.value),
							placeholder: "Outra atividade"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							disabled: !customAct.trim() || !eq,
							onClick: () => {
								if (!eq) return;
								onAddActivity(customAct.trim(), eq.id).then((id) => {
									set({ activityId: id });
									setCustomAct("");
									setOpen("rua");
								});
							},
							children: "Incluir"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
				n: 4,
				title: "Onde",
				summary: street?.name ?? (locationLabel || void 0),
				open: open === "rua",
				onToggle: () => setOpen(open === "rua" ? "detalhe" : "rua"),
				children: [
					gps.status === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-2 text-xs text-ok",
						children: [
							"GPS ligado",
							locationLabel ? ` · ${locationLabel}` : "",
							". Confira a rua ou troque abaixo."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs text-muted",
						children: "Escolha a rua da frente. O GPS grava o ponto ao salvar."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: qSt,
						onChange: (e) => setQSt(e.target.value),
						placeholder: "Filtrar rua…",
						className: "mb-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceList, {
						options: streetOpts,
						value: draft.streetId,
						onChange: (id) => {
							set({ streetId: id });
							setOpen("detalhe");
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
				n: 5,
				title: "Detalhes",
				summary: [
					draft.estaca && `E ${draft.estaca}`,
					draft.pv,
					draft.start
				].filter(Boolean).join(" · ") || "Opcional",
				open: open === "detalhe",
				onToggle: () => setOpen(open === "detalhe" ? "eq" : "detalhe"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Estaca" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.estaca,
								onChange: (e) => set({ estaca: e.target.value }),
								placeholder: "15+20"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex gap-2",
								children: ["+20", "+50"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "secondary",
									onClick: () => bumpEstaca(draft.estaca, Number(s), set),
									children: s
								}, s))
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PV" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.pv,
								onChange: (e) => set({ pv: e.target.value.toUpperCase() }),
								placeholder: "PVD-08"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
									options: [...PV_PREFIXES],
									onChange: (p) => {
										const num = draft.pv.replace(/^[A-Z]+-?/, "");
										set({ pv: num ? `${p}-${num}` : `${p}-` });
									}
								})
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Horário" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-1 text-xs text-muted",
										children: "Início"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										value: draft.start,
										onChange: (e) => set({ start: e.target.value })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										variant: "ghost",
										className: "mt-1 px-0",
										onClick: () => set({ start: nowHHMM() }),
										children: "Agora"
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-1 text-xs text-muted",
										children: "Término"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										value: draft.end,
										disabled: !draft.ended,
										onChange: (e) => set({ end: e.target.value })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										variant: "ghost",
										className: "mt-1 px-0",
										onClick: () => set({
											ended: !draft.ended,
											end: nowHHMM()
										}),
										children: draft.ended ? "Deixar em andamento" : "Já encerrou"
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								className: "mt-2",
								value: draft.date,
								onChange: (e) => set({ date: e.target.value })
							})
						]
					}),
					qtyLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: qtyLabel }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "secondary",
									onClick: () => stepQty(draft.quantity, -1, set),
									children: "−"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "numeric",
									value: draft.quantity,
									onChange: (e) => set({ quantity: e.target.value.replace(/[^\d]/g, "") }),
									className: "text-center tabular-nums"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "secondary",
									onClick: () => stepQty(draft.quantity, 1, set),
									children: "+"
								})
							]
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observação" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
								options: NOTE_CHIPS,
								onChange: (n) => set({ notes: draft.notes ? `${draft.notes} / ${n}` : n })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-2",
								value: draft.notes,
								onChange: (e) => set({ notes: e.target.value }),
								placeholder: "Opcional"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [work ? `${work.code} ${work.name}` : "Sem obra", " · save global: a equipe vê na hora, até Encerrar"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print fixed inset-x-0 bottom-0 z-20 mx-auto max-w-lg border-t border-border bg-surface/95 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 flex h-4 items-center justify-center text-[11px] text-muted",
						children: saveState === "saving" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }), " Salvando para a equipe…"]
						}) : saveState === "saved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 text-ok",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }), " Salvo · todos veem"]
						}) : saveState === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-danger",
							children: "Não salvou. Toque de novo."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Preencha máquina, atividade e rua" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						size: "lg",
						disabled: !canSave,
						onClick: onSubmit,
						children: submitLabel
					}),
					openHint && onEncerrar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-2 w-full",
						size: "lg",
						variant: "outline",
						onClick: onEncerrar,
						children: "Encerrar atividade"
					}) : null
				]
			})
		]
	});
}
function Step({ n, title, summary, open, onToggle, children }) {
	const done = Boolean(summary);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "overflow-hidden rounded-xl border border-border bg-surface shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onToggle,
			className: "flex w-full items-center gap-3 px-3 py-3 text-left",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold", done ? "bg-ok text-ok-fg" : "bg-surface-2 text-muted"),
					children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						className: "size-3.5",
						strokeWidth: 3
					}) : n
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-semibold",
						children: title
					}), summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate text-xs text-muted",
						children: summary
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 text-subtle transition-transform duration-200 ease-out", open ? "rotate-180" : "rotate-0") })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("grid transition-[grid-template-rows,opacity] duration-200 ease-out", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 pb-3",
					children
				})
			})
		})]
	});
}
function bumpEstaca(current, delta, set) {
	const plus = current.match(/^(\d+)\+(\d+)$/);
	if (plus) {
		let km = Number(plus[1]);
		let m = Number(plus[2]) + delta;
		while (m >= 100) {
			km += 1;
			m -= 100;
		}
		while (m < 0) {
			km -= 1;
			m += 100;
		}
		if (km < 0) return;
		set({ estaca: `${km}+${String(m).padStart(2, "0")}` });
		return;
	}
	const n = current.replace(/\D/g, "");
	if (!n) {
		set({ estaca: String(Math.max(0, delta)) });
		return;
	}
	set({ estaca: String(Math.max(0, Number(n) + delta)) });
}
function stepQty(current, d, set) {
	const n = Math.max(0, (Number(current) || 0) + d);
	set({ quantity: n ? String(n) : "" });
}
function emptyDraft(last) {
	return {
		date: todayISO(),
		start: nowHHMM(),
		end: nowHHMM(),
		ended: false,
		workId: last.workId,
		streetId: last.streetId,
		equipmentId: last.equipmentId,
		activityId: last.activityId,
		estaca: "",
		pv: "",
		quantity: "",
		notes: ""
	};
}
function draftFromApontamento(a) {
	return {
		id: a.id,
		date: a.date,
		start: a.start,
		end: a.end ?? nowHHMM(),
		ended: Boolean(a.end),
		workId: a.workId,
		streetId: a.streetId,
		equipmentId: a.equipmentId,
		activityId: a.activityId,
		estaca: a.estaca,
		pv: a.pv,
		quantity: a.quantity == null ? "" : String(a.quantity),
		notes: a.notes
	};
}
function Novo() {
	const { edit } = Route$1.useSearch();
	const navigate = useNavigate();
	const initial = Route$1.useLoaderData();
	const { data, isLoading } = useSnapshot(initial, true);
	const gps = useGps();
	const upsert = useUpsertApontamento();
	const closeMut = useCloseApontamento();
	const invalidate = useInvalidateSnapshot();
	const last = loadLast();
	const [draft, setDraft] = (0, import_react.useState)(() => emptyDraft(last));
	const [saveState, setSaveState] = (0, import_react.useState)("idle");
	const idRef = (0, import_react.useRef)(edit || uid());
	const hydrated = (0, import_react.useRef)(null);
	const streetTouched = (0, import_react.useRef)(false);
	const matchedStreet = (0, import_react.useRef)(false);
	const gpsLat = gps.status === "ready" ? gps.lat : null;
	const gpsLng = gps.status === "ready" ? gps.lng : null;
	const gpsAcc = gps.status === "ready" ? gps.accuracy : null;
	const place = usePlaceLabel(gpsLat, gpsLng);
	const current = data?.apontamentos.find((a) => a.id === idRef.current);
	const openRow = current && !current.end ? current : openForEquipment(data?.apontamentos ?? [], draft.equipmentId);
	const isOpenEdit = Boolean(openRow && idRef.current === openRow.id && !draft.ended);
	usePresencePing(gps, {
		workId: draft.workId,
		streetId: draft.streetId,
		equipmentId: draft.equipmentId,
		activityId: draft.activityId,
		apontamentoId: isOpenEdit ? idRef.current : openRow?.id ?? null
	});
	(0, import_react.useEffect)(() => {
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
	}, [
		edit,
		data?.apontamentos,
		last.equipmentId
	]);
	(0, import_react.useEffect)(() => {
		if (edit || isOpenEdit) return;
		if (streetTouched.current || matchedStreet.current) return;
		if (!place.road && !place.label) return;
		if (gpsAcc != null && gpsAcc > 45) return;
		const hit = matchStreetByLabel(place.road || place.label, data?.streets ?? [], draft.workId);
		if (hit && hit.id !== draft.streetId) {
			matchedStreet.current = true;
			setDraft((d) => ({
				...d,
				streetId: hit.id
			}));
		}
	}, [
		edit,
		isOpenEdit,
		place.road,
		place.label,
		data?.streets,
		draft.workId,
		draft.streetId,
		gpsAcc
	]);
	function onChangeDraft(next) {
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
						activityId: ""
					}),
					date: next.date
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
				deviceId: getDeviceId()
			});
			idRef.current = saved.id;
			saveLast({
				workId: draft.workId,
				streetId: draft.streetId,
				equipmentId: draft.equipmentId,
				activityId: draft.activityId
			});
			setSaveState("saved");
			toast.success(saved.end ? "Atividade encerrada para a equipe" : isOpenEdit ? "Atividade atualizada — continua aberta até Encerrar" : "Atividade aberta para toda a equipe");
			navigate({ to: "/" });
		} catch {
			setSaveState("error");
		}
	}
	async function encerrar() {
		await closeMut.mutateAsync({
			id: idRef.current,
			end: nowHHMM()
		});
		toast.success("Atividade encerrada");
		navigate({ to: "/" });
	}
	if (isLoading && !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		hideNav: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenLoader, {})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideNav: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-3 px-3 pb-2 pt-[max(12px,env(safe-area-inset-top))]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void navigate({ to: "/" }),
					className: "flex size-12 items-center justify-center rounded-md text-fg",
					"aria-label": "Voltar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-xl font-semibold",
						children: isOpenEdit ? "Atividade em andamento" : edit ? "Editar apontamento" : "Nova atividade"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: isOpenEdit ? "Save global: a equipe vê isto até alguém encerrar." : "Nada é criado sozinho. Toque em Concluir para abrir a atividade."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GpsBanner, { gps })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApontamentoForm, {
					draft,
					onChange: onChangeDraft,
					onSubmit: () => void persist(),
					submitLabel: isOpenEdit ? "Salvar alterações" : edit ? "Concluir alteração" : "Abrir atividade",
					works: data?.works ?? [],
					streets: data?.streets ?? [],
					equipment: data?.equipment ?? [],
					activities: data?.activities ?? [],
					gps,
					locationLabel: place.label,
					saveState,
					openHint: isOpenEdit,
					onEncerrar: isOpenEdit ? () => void encerrar() : void 0,
					onAddActivity: async (name, equipmentId) => {
						const { id } = await addActivity({ data: {
							name,
							equipmentId
						} });
						await invalidate();
						return id;
					}
				})
			})
		]
	});
}
//#endregion
export { Novo as component };
