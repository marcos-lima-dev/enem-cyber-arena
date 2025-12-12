"use client";

import { cn } from "@/lib/utils";

interface GlitchTitleProps {
  text: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function GlitchTitle({ text, size = "lg", className }: GlitchTitleProps) {
  return (
    <div className={cn("relative inline-block font-black tracking-tighter group select-none", className)}>
      {/* Texto Base */}
      <h1 className={cn(
        "relative z-10 text-white mix-blend-difference",
        size === "sm" && "text-2xl",
        size === "md" && "text-4xl",
        size === "lg" && "text-6xl md:text-7xl",
        size === "xl" && "text-8xl"
      )}>
        {text}
      </h1>

      {/* Camada de Glitch 1 (Ciano/Lime) - Deslocada levemente */}
      <span className={cn(
        "absolute top-0 left-0 -z-10 w-full h-full text-primary opacity-70 animate-glitch",
        size === "sm" && "text-2xl",
        size === "md" && "text-4xl",
        size === "lg" && "text-6xl md:text-7xl",
        size === "xl" && "text-8xl"
      )}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)", transform: "translate(-2px, -2px)" }}>
        {text}
      </span>

      {/* Camada de Glitch 2 (Rosa/Vermelho) - Deslocada oposta */}
      <span className={cn(
        "absolute top-0 left-0 -z-10 w-full h-full text-destructive opacity-70 animate-glitch",
        size === "sm" && "text-2xl",
        size === "md" && "text-4xl",
        size === "lg" && "text-6xl md:text-7xl",
        size === "xl" && "text-8xl"
      )}
      style={{ animationDirection: "reverse", clipPath: "polygon(0 80%, 100% 20%, 100% 100%, 0 100%)", transform: "translate(2px, 2px)" }}>
        {text}
      </span>
    </div>
  );
}