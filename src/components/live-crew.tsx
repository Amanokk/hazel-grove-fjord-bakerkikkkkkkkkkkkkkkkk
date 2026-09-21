import { Link } from "@tanstack/react-router";
import { Radio, Users } from "lucide-react";
import type { CrewMember } from "@/lib/crew";
import { formatAccuracy, relativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function LiveCrew({
  members,
  compact = false,
}: {
  members: CrewMember[];
  compact?: boolean;
}) {
  const others = members.filter((m) => !m.isSelf);
  const online = members.filter((m) => m.online).length;

  return (
    <section className="rounded-xl border border-border bg-surface p-3 shadow-card">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-live-dot rounded-full bg-ok" />
            <span className="relative inline-flex size-2.5 rounded-full bg-ok" />
          </span>
          <h2 className="font-display text-base font-semibold">Equipe ao vivo</h2>
        </div>
        <p className="text-xs tabular-nums text-muted">
          {online} no campo · {members.length}
        </p>
      </div>

      {members.length === 0 ? (
        <div className="flex flex-col items-center gap-1 px-3 py-6 text-center">
          <Users className="size-5 text-subtle" />
          <p className="text-sm text-muted">Ninguém no mapa ainda. Ative o GPS e ponha um apelido.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {members.map((m) => (
            <CrewRow key={m.id} member={m} compact={compact} />
          ))}
        </ul>
      )}

      {compact && others.length > 0 ? (
        <Link to="/mapa" className="mt-2 block text-center text-xs font-medium text-primary">
          Ver no mapa
        </Link>
      ) : null}
    </section>
  );
}

function CrewRow({ member: m, compact }: { member: CrewMember; compact: boolean }) {
  const inner = (
    <>
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-2">
        {m.online ? (
          <Radio className="size-4 text-ok" />
        ) : (
          <Users className="size-4 text-muted" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">
            {m.isSelf ? (m.label && m.label !== "Você" && m.label !== "No campo" ? `${m.label} · você` : "Você") : m.label}
          </p>
          <StatusPill member={m} />
        </div>
        <p className="truncate text-xs text-muted">
          {m.equipmentName || "Sem máquina"}
          {m.activityName ? ` · ${m.activityName}` : " · sem atividade aberta"}
        </p>
        {compact ? null : (
          <p className="truncate text-xs text-subtle">
            {m.streetName || m.workName || "Posição GPS"}
            {m.distanceM != null ? ` · ${formatAccuracy(m.distanceM)}` : ""}
            {m.updatedAt ? ` · ${relativeTime(m.updatedAt)}` : ""}
          </p>
        )}
      </div>
    </>
  );

  if (m.apontamentoId) {
    return (
      <li>
        <Link
          to="/novo"
          search={{ edit: m.apontamentoId }}
          className="flex items-start gap-3 rounded-lg bg-surface-2 px-3 py-2"
        >
          {inner}
        </Link>
      </li>
    );
  }

  return <li className="flex items-start gap-3 rounded-lg bg-surface-2 px-3 py-2">{inner}</li>;
}

function StatusPill({ member: m }: { member: CrewMember }) {
  const label = m.online ? "ao vivo" : m.stale ? "há pouco" : m.apontamentoId ? "andamento" : "offline";
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        m.online ? "bg-ok-fg text-ok" : m.apontamentoId ? "bg-ok-fg/70 text-ok" : "bg-surface text-muted",
      )}
    >
      {label}
    </span>
  );
}
