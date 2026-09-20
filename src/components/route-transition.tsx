"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

type VTDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => {
    finished?: Promise<unknown>;
  };
};

let navigateImpl: ((href: string) => void) | null = null;
// 导航序号：只有最新一次导航有权做收尾滚顶，防止旧过渡的 finished 抢跑新导航
let navSeq = 0;
// 本次导航是否由浏览器前进/后退（popstate）触发：不强制回顶，交给浏览器恢复滚动
let popstateNav = false;
// 被内联隐藏的博客导航/面包屑（切到无导航页面时隐藏，导航结束后恢复）
let hiddenChrome: HTMLElement[] = [];

/** 目标页是否带博客导航/面包屑（仅 /blog 下有） */
function destHasBlogChrome(href: string) {
  return href.startsWith("/blog");
}

/**
 * 同步隐藏实时 DOM 中的导航条与面包屑（内联样式，点击/popstate 帧即生效）。
 * startViewTransition 的旧快照捕获会滞后一拍（主线程忙时数百毫秒），期间
 * 屏幕显示的仍是实时 DOM，不隐藏的话旧导航会残留到捕获完成才消失。
 */
function hideBlogChrome() {
  if (hiddenChrome.length) return;
  hiddenChrome = Array.from(
    document.querySelectorAll<HTMLElement>("[data-vt-site-nav], [data-vt-breadcrumbs]"),
  );
  for (const el of hiddenChrome) el.style.visibility = "hidden";
}

/** 恢复被隐藏的导航/面包屑（导航成功后元素已卸载，对游离节点设样式无副作用） */
function restoreBlogChrome() {
  for (const el of hiddenChrome) el.style.visibility = "";
  hiddenChrome = [];
}

/** 供非链接场景（如命令面板）使用的带过渡导航 */
export function navigateWithTransition(href: string) {
  navigateImpl?.(href);
}

/**
 * 全局路由切换过渡：
 * 捕获内部 <a> 点击，用 View Transitions API 包裹 router.push，
 * 等新页面 commit 后播放由 data-vt-effect 指定的过渡动画。
 * 浏览器前进/后退（popstate）不走过渡，但同样同步隐藏导航/面包屑。
 */
export function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const pendingResolve = useRef<(() => void) | null>(null);
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useLayoutEffect(() => {
    if (pendingResolve.current) {
      // 新页面 commit 后先等 Next 的 scroll 处理（恢复/滚顶）全部跑完，
      // 再最后写入滚顶并放行截图：过早 resolve 会把 Next 恢复的旧滚动位置
      // 截进新页快照，导致落地后“先在下面再跳上去”
      const wasPopstate = popstateNav;
      const timer = setTimeout(() => {
        // 后退/前进由浏览器恢复滚动位置，仅点击导航强制回顶
        if (!wasPopstate) window.scrollTo(0, 0);
        pendingResolve.current?.();
        pendingResolve.current = null;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    // 过渡效果由 localStorage 记忆，默认缩放，历史值一律回落
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("vtEffect");
    } catch {
      // localStorage 不可用时用默认值
    }
    document.documentElement.dataset.vtEffect =
      saved === "zoom" || saved === "fade" ? saved : "zoom";

    const nav = (href: string) => {
      const doc = document as VTDocument;
      if (typeof doc.startViewTransition !== "function") {
        router.push(href);
        return;
      }
      const seq = ++navSeq;
      popstateNav = false;
      // 有挂起的过渡先放行（新的 startViewTransition 会 skip 它），避免 promise 悬挂到 2s 超时
      pendingResolve.current?.();
      // 门控面包屑入场动画（见 globals.css data-vt-active）：必须在 startViewTransition
      // 之前置位，新页面挂载时规则已生效，过渡快照才能拍到完整不透明的面包屑。
      // 置位后不再清除——清除会让 blur-in 重新播放造成二次闪烁；刷新页面自然复位。
      document.documentElement.dataset.vtActive = "true";
      const toBlog = destHasBlogChrome(href);
      if (toBlog) {
        delete document.documentElement.dataset.vtNoChrome;
        restoreBlogChrome();
      } else {
        // 目标页没有博客导航（如主页、404）：
        // 1) 同步隐藏实时导航/面包屑（内联样式，点击帧即生效）
        hideBlogChrome();
        // 2) 标记本次过渡不渲染旧导航/面包屑快照（见 globals.css data-vt-no-chrome）
        document.documentElement.dataset.vtNoChrome = "true";
      }
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
      // 动画播完后收尾；seq 不匹配说明期间已发生更新的导航，收尾归属新导航
      void transition.finished?.finally(() => {
        if (seq !== navSeq) return;
        if (!popstateNav) window.scrollTo(0, 0);
        // 导航异常中止（仍停在博客页）时恢复被隐藏的导航；成功时元素已卸载，
        // 对游离节点清样式无副作用
        restoreBlogChrome();
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

    // 浏览器前进/后退不经过链接点击，也没有过渡：退到没有博客导航的页面时
    // 同步隐藏导航/面包屑，避免旧导航条原样挂到 Next 换页完成才消失
    const onPopstate = () => {
      if (location.pathname === pathnameRef.current) return;
      // 递增序号使仍在飞行的点击过渡的收尾逻辑失效
      navSeq++;
      popstateNav = true;
      pendingResolve.current?.();
      if (!destHasBlogChrome(location.pathname)) {
        document.documentElement.dataset.vtNoChrome = "true";
        hideBlogChrome();
      }
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopstate);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopstate);
      navigateImpl = null;
    };
  }, [router]);

  return null;
}
