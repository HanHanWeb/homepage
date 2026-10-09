"use client";

import { useEffect, useState } from "react";

/**
 * 图片轮播：多图自动滚动播放（悬停暂停），点击任意图打开灯箱。
 * 单图时不自动切换，仅提供灯箱放大。
 * 同 group 的图片在灯箱内可左右切换，也可滚轮/拖动浏览。
 */
export function ShotCarousel({
  images,
  hint,
  group,
  className,
  aspectClassName = "aspect-video",
  cropTop,
}: {
  images: readonly { src: string; alt: string }[];
  /** 底部提示条文字，省略则不渲染提示条 */
  hint?: string;
  /** 灯箱分组名 */
  group: string;
  /** 外层附加类名（圆角、跨列等由调用方决定） */
  className?: string;
  /** 图片区域宽高比类名 */
  aspectClassName?: string;
  cropTop?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [paused, images.length]);

  return (
    <div
      className={`group relative overflow-hidden bg-muted ${className ?? ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            loading="lazy"
            draggable={false}
            className={`${aspectClassName} w-full shrink-0 cursor-zoom-in object-cover ${cropTop ? "object-top" : ""}`}
            data-fancybox={group}
            data-caption={img.alt}
          />
        ))}
      </div>
      {hint && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/55 to-transparent px-3 pt-8 pb-2.5 text-xs text-white">
          {hint}
        </div>
      )}
      {images.length > 1 && (
        <span className="pointer-events-none absolute right-2.5 bottom-2.5 rounded-full bg-black/55 px-2 py-0.5 text-[11px] text-white/90">
          {index + 1} / {images.length}
        </span>
      )}
    </div>
  );
}