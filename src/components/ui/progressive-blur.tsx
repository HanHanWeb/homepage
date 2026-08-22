"use client";

import React from "react";

import { cn } from "@/lib/utils";

export interface ProgressiveBlurProps {
  className?: string;
  height?: string;
  position?: "top" | "bottom" | "both";
  blurLevels?: number[];
  children?: React.ReactNode;
}

export function ProgressiveBlur({
  className,
  height = "30%",
  position = "bottom",
  blurLevels = [2, 24],
}: ProgressiveBlurProps) {
  // 每层遮罩带的步长随层数变化（8 层时为 12.5%）
  const step = 100 / blurLevels.length;
  // 中间层数量 = 总层数 - 首尾两层
  const divElements = Array(blurLevels.length - 2).fill(null);

  // 第 k 层的遮罩：淡入 k·step → (k+1)·step，实心至 (k+2)·step，再淡出
  const layerMask = (k: number) => {
    if (position === "both") {
      return "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)";
    }
    const dir = position === "bottom" ? "to bottom" : "to top";
    return `linear-gradient(${dir}, rgba(0,0,0,0) ${k * step}%, rgba(0,0,0,1) ${
      (k + 1) * step
    }%, rgba(0,0,0,1) ${(k + 2) * step}%, rgba(0,0,0,0) ${(k + 3) * step}%)`;
  };

  return (
    <div
      className={cn(
        "gradient-blur pointer-events-none absolute inset-x-0 z-10",
        className,
        position === "top"
          ? "top-0"
          : position === "bottom"
            ? "bottom-0"
            : "inset-y-0",
      )}
      style={{
        height: position === "both" ? "100%" : height,
      }}
    >
      {/* 首层（最弱）：从边缘淡入 */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backdropFilter: `blur(${blurLevels[0]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[0]}px)`,
          maskImage: layerMask(0),
          WebkitMaskImage: layerMask(0),
        }}
      />

      {/* 中间层 */}
      {divElements.map((_, index) => {
        const blurIndex = index + 1;
        return (
          <div
            key={`blur-${index}`}
            className="absolute inset-0"
            style={{
              zIndex: blurIndex + 1,
              backdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              WebkitBackdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              maskImage: layerMask(blurIndex),
              WebkitMaskImage: layerMask(blurIndex),
            }}
          />
        );
      })}

      {/* 末层（最强）：在最边缘达到全强度 */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: blurLevels.length,
          backdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
          maskImage: layerMask(blurLevels.length - 1),
          WebkitMaskImage: layerMask(blurLevels.length - 1),
        }}
      />
    </div>
  );
}
