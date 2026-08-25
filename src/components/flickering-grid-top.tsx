"use client";

import { useTheme } from "next-themes";

import { FlickeringGrid } from "@/registry/magicui/flickering-grid";

export function FlickeringGridTop() {
  const { resolvedTheme } = useTheme();

  const color =
    resolvedTheme === "light" ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-[46] h-[15vh] overflow-hidden"
    >
      <div
        className="h-full w-full"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 55%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, #000 55%, transparent 100%)",
        }}
      >
        <FlickeringGrid
          squareSize={4}
          gridGap={6}
          flickerChance={0.3}
          color={color}
          maxOpacity={0.15}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
