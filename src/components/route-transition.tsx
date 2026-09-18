"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

type VTDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => {
    finished?: Promise<unknown>;
  };
};

/** 路径层级越深视为“前进”，反之“返回”，决定浮入方向 */
function getDirection(to: string): "forward" | "back" {
  const depth = (p: string) => new URL(p, window.location.href).pathname.split("/").filter(Boolean).length;
  return depth(to) > depth(window.location.pathname) ? "forward" : "back";
}

let navigateImpl: ((href: string) => void) | null = null;
// 导航序号：只有最新一次导航有权做收尾清理，防止旧过渡的 finished 误删新导航的方向属性
let navSeq = 0;

/** 供非链接场景（如命令面板）使用的带过渡导航 */
export function navigateWithTransition(href: string) {
  navigateImpl?.(href);
}

/**
 * 全局路由切换过渡：
 * 捕获内部 <a> 点击，用 View Transitions API 包裹 router.push，
 * 等新页面 commit 后播放左右浮入浮出动画（方向由路径深浅决定）。
 */
export function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const pendingResolve = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    if (pendingResolve.current) {
      // 新页面 commit 后先等 Next 的 scroll 处理（恢复/滚顶）全部跑完，
      // 再最后写入滚顶并放行截图：过早 resolve 会把 Next 恢复的旧滚动位置
      // 截进新页快照，导致落地后“先在下面再跳上去”
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        pendingResolve.current?.();
        pendingResolve.current = null;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    const nav = (href: string) => {
      const doc = document as VTDocument;
      if (typeof doc.startViewTransition !== "function") {
        router.push(href);
        return;
      }
      const seq = ++navSeq;
      document.documentElement.dataset.vtDirection = getDirection(href);
      // 有挂起的过渡先放行（新的 startViewTransition 会 skip 它），避免 promise 悬挂到 2s 超时
      pendingResolve.current?.();
      const transition = doc.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            // 超时保底：导航异常时也要结束过渡，避免页面被冻结
            const timer = setTimeout(() => resolve(), 2000);
            pendingResolve.current = () => {
              clearTimeout(timer);
              resolve();
            };
            router.push(href);
          }),
      );
      // 动画播完后回顶兜底并清理方向标记；seq 不匹配说明期间已发生更新的导航，
      // 此时属性归属新导航，不能删，否则新导航的动画会因选择器失配而失效
      void transition.finished?.finally(() => {
        if (seq !== navSeq) return;
        window.scrollTo(0, 0);
        delete document.documentElement.dataset.vtDirection;
      });
    };
    navigateImpl = nav;

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      // 新窗口打开 / 下载链接交给浏览器原生行为
      if ((anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download"))
        return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // 同页链接（锚点滚动等）交给原生行为
      if (url.pathname === window.location.pathname && url.search === window.location.search)
        return;
      e.preventDefault();
      nav(url.pathname + url.search);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      navigateImpl = null;
    };
  }, [router]);

  return null;
}
