import { cn } from "@/lib/cn";
import type { LabAgent } from "@/lib/types";
import { getCopy } from "@/lib/lang-server";

/** Tarjeta de agente del Lab. El estado siempre se dice con texto, no solo con color. */
export async function AgentCard({ agent }: { agent: LabAgent }) {
  const estado = (await getCopy()).copy.lab.estado;
  const done = agent.status === "Hecho";
  return (
    <div
      className={cn(
        "rounded-card border bg-surface p-6",
        done ? "border-line" : "border-violet-500",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="eyebrow">{agent.number}</p>
        <p
          className={cn(
            "text-sm leading-[22px]",
            done ? "text-green-400" : "text-fg-muted",
          )}
        >
          {estado[agent.status] ?? agent.status}
        </p>
      </div>
      <h3 className="mt-4 font-serif text-xl font-black leading-[26px] text-fg">
        {agent.title}
      </h3>
      <p className="mt-2 text-sm leading-[22px] text-fg-muted">{agent.body}</p>
    </div>
  );
}
