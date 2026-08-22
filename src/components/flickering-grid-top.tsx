"use client";

import { useTheme } from "next-themes";

import { FlickeringGrid } from "@/registry/magicui/flickering-grid";

/**
 * 页面顶部 Flickering Grid（随页面滚动）：
 * 只出现在文档最顶端，向下滚动即随之移出视野；深色模式白点，浅色模式黑点。
 * 层级刻意高于顶部渐进模糊层（z-40）：静止时点阵保持清晰，
 * 顶部模糊条只负责模糊向下滚动穿过的正文内容。
 */
export function FlickeringGridTop() {
  const { resolvedTheme } = useTheme();

  // 深色默认白点，浅色黑点
  const color =
    resolvedTheme === "light" ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-[46] h-[15vh] overflow-hidden"
    >
      {/* 点阵自身向下淡出（mask 不遮挡内容） */}
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
