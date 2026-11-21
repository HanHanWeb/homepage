"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/** 图片飞入弹窗的几何信息：从点击的封面位置过渡到弹窗内图片位置 */
export type ImageFlight = {
  src: string;
  from: DOMRect;
  to: DOMRect;
  cropTop?: boolean;
};

/**
 * 共享元素飞行：记录点击时的封面位置，等弹窗图片解码布局完成后
 * 用同一张位图补间过渡；1 秒内未就绪则直接显示弹窗内容。
 * focus 与 projects 两个预览弹窗共用，避免两份实现漂移。
 */
export function useImageFlight(
  enabled: boolean,
  reducedMotion: boolean | null,
  imageRef: RefObject<HTMLImageElement | null>,
) {
  const [flight, setFlight] = useState<ImageFlight | null>(null);
  const [revealed, setRevealed] = useState(true);
  const pendingFlight = useRef<{ src: string; rect: DOMRect; cropTop?: boolean } | null>(null);

  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const pending = pendingFlight.current;
    if (!pending) return;

    let cancelled = false;
    let settled = false;
    let frame = 0;

    const reveal = () => {
      if (cancelled || settled) return;
      settled = true;
      pendingFlight.current = null;
      setRevealed(true);
    };

    const measure = () => {
      if (cancelled || settled) return;

      const image = imageRef.current;
      const rect = image?.getBoundingClientRect();

      if (image?.complete && image.naturalWidth > 0 && rect && rect.width > 1 && rect.height > 1) {
        settled = true;
        pendingFlight.current = null;
        window.clearTimeout(timeout);
        setFlight({ src: pending.src, from: pending.rect, to: rect, cropTop: pending.cropTop });
        return;
      }

      frame = requestAnimationFrame(measure);
    };

    const timeout = window.setTimeout(reveal, 1000);
    frame = requestAnimationFrame(measure);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [enabled, reducedMotion, imageRef]);

  /** 打开弹窗时记录封面几何；无可用来源时跳过飞行直接显示 */
  const begin = useCallback(
    (source: { src: string; rect: DOMRect; cropTop?: boolean } | null) => {
      pendingFlight.current = source;
      setFlight(null);
      setRevealed(!source || reducedMotion === true);
    },
    [reducedMotion],
  );

  /** 结束飞行（动画完成或关闭弹窗）：显示真实内容并清理飞行层 */
  const settle = useCallback(() => {
    setFlight(null);
    setRevealed(true);
  }, []);

  return { flight, revealed, begin, settle };
}
