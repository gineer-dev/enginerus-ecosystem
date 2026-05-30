import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModuleHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  primaryAction = "Create record",
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  primaryAction?: string;
}) {
  return (
    <section className="reference-surface grid gap-5 p-6 lg:grid-cols-[1fr_auto] lg:p-7">
      <div className="flex gap-4">
        <span className="grid h-13 w-13 shrink-0 place-items-center rounded-xl bg-primary text-accent">
          <Icon className="h-7 w-7" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-black tracking-normal sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Button type="button">{primaryAction}</Button>
      </div>
    </section>
  );
}
