"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const frameInterval = 1000 / 20;

interface FlickeringGridProps extends HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  maxOpacity?: number;
}

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef(color);
  const repaint = useRef<(() => void) | null>(null);

  useEffect(() => {
    colorRef.current = color;
    repaint.current?.();
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const step = squareSize + gridGap;
    let rows = 0;
    let squares = new Float32Array(0);
    let pixelSize = 0;
    let pixelStep = 0;
    let logicalWidth = 0;
    let logicalHeight = 0;
    let pixelRatio = 0;
    let visible = false;
    let frame = 0;
    let lastTime: number | undefined;

    const paintSquare = (index: number, clear: boolean) => {
      const x = Math.round(Math.floor(index / rows) * pixelStep);
      const y = Math.round((index % rows) * pixelStep);
      if (clear) ctx.clearRect(x, y, pixelSize, pixelSize);
      ctx.globalAlpha = squares[index];
      ctx.fillRect(x, y, pixelSize, pixelSize);
    };

    const paintAll = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = colorRef.current;
      for (let i = 0; i < squares.length; i++) paintSquare(i, false);
    };
    repaint.current = paintAll;

    const resize = () => {
      const nextWidth = width ?? container.clientWidth;
      const nextHeight = height ?? container.clientHeight;
      const nextRatio = window.devicePixelRatio || 1;
      if (nextWidth === logicalWidth && nextHeight === logicalHeight && nextRatio === pixelRatio) return;

      logicalWidth = nextWidth;
      logicalHeight = nextHeight;
      pixelRatio = nextRatio;
      pixelStep = step * pixelRatio;
      pixelSize = Math.round(squareSize * pixelRatio);
      canvas.width = Math.round(logicalWidth * pixelRatio);
      canvas.height = Math.round(logicalHeight * pixelRatio);
      canvas.style.width = `${logicalWidth}px`;
      canvas.style.height = `${logicalHeight}px`;
      rows = Math.ceil(logicalHeight / step);
      const columns = Math.ceil(logicalWidth / step);
      squares = Float32Array.from({ length: columns * rows }, () => Math.random() * maxOpacity);
      paintAll();
    };

    const animate = (time: number) => {
      frame = requestAnimationFrame(animate);
      if (lastTime !== undefined && time - lastTime < frameInterval) return;

      const elapsed = Math.min((time - (lastTime ?? time)) / 1000, 0.1);
      lastTime = time;
      const chance = flickerChance * elapsed;
      // Each square has its own empty space, so a change only needs a local repaint.
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() >= chance) continue;
        squares[i] = Math.random() * maxOpacity;
        paintSquare(i, true);
      }
    };

    const syncAnimation = () => {
      if (visible && !document.hidden && !reducedMotion.matches && flickerChance > 0) {
        if (!frame) frame = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = undefined;
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    });
    visibilityObserver.observe(container);
    document.addEventListener("visibilitychange", syncAnimation);
    reducedMotion.addEventListener("change", syncAnimation);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", syncAnimation);
      reducedMotion.removeEventListener("change", syncAnimation);
      repaint.current = null;
    };
  }, [flickerChance, gridGap, height, maxOpacity, squareSize, width]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} {...props}>
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  );
}
