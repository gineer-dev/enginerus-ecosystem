import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 w-full rounded-sm border-0 bg-muted px-4 text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-primary/30",
        props.className,
      )}
    />
  );
}
