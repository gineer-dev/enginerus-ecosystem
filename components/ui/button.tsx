import * as React from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-[0_8px_16px_rgba(120,35,36,0.32)] hover:bg-[#641d1e]",
  secondary: "power-quote hover:brightness-105",
  outline: "border border-[#d17e1d]/40 bg-card/90 hover:bg-[#fff8e1]",
  ghost: "hover:bg-muted",
  danger: "bg-[#a83232] text-white hover:bg-[#842727]",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-10 min-h-10 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
