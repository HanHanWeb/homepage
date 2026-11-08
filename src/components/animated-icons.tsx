"use client";

import { useEffect, useRef, useState, type ComponentType, type MouseEvent, type Ref, type SVGProps } from "react";
import type { Animation, UseAnimationsProps } from "react-useanimations";

import { cn } from "@/lib/utils";

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };
type AnimationLoader = () => Promise<{ default: Animation }>;
type IconPlayer = { Player: ComponentType<UseAnimationsProps>; animation: Animation };
const iconTriggers = "button, a, [role^='menuitem'], [cmdk-item], [data-slot='badge']";

function createIcon(name: string, load?: AnimationLoader) {
  return function AnimatedIcon({ size = 24, className, children, ...props }: IconProps) {
    const icon = useRef<SVGSVGElement>(null);
    const [active, setActive] = useState(false);
    const [motion, setMotion] = useState<IconPlayer | null>(null);

    useEffect(() => {
      const element = icon.current;
      if (!element) return;

      const trigger = element.closest(iconTriggers) ?? element;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      let hovered = false;
      let focused = false;
      let requested = false;
      let mounted = true;

      function sync() {
        const next = !reducedMotion.matches && (hovered || focused) && Boolean(element?.getClientRects().length);
        setActive(next);
        if (!next || !load || requested) return;

        requested = true;
        void Promise.all([import("react-useanimations"), load()])
          .then(([player, data]) => {
            if (mounted) setMotion({ Player: player.default, animation: data.default });
          })
          .catch(() => { requested = false; });
      }

      function enter(event: Event) {
        if ((event as PointerEvent).pointerType === "touch") return;
        hovered = true;
        sync();
      }

      function leave() { hovered = false; sync(); }
      function focus() { focused = trigger.matches(":focus-visible"); sync(); }
      function blur() { focused = false; sync(); }

      trigger.addEventListener("pointerenter", enter);
      trigger.addEventListener("pointerleave", leave);
      trigger.addEventListener("focusin", focus);
      trigger.addEventListener("focusout", blur);
      reducedMotion.addEventListener("change", sync);
      hovered = window.matchMedia("(hover: hover)").matches && trigger.matches(":hover");
      focus();

      return () => {
        mounted = false;
        trigger.removeEventListener("pointerenter", enter);
        trigger.removeEventListener("pointerleave", leave);
        trigger.removeEventListener("focusin", focus);
        trigger.removeEventListener("focusout", blur);
        reducedMotion.removeEventListener("change", sync);
      };
    }, []);

    useEffect(() => {
      const layer = icon.current?.querySelector(".site-icon-animation");
      if (!layer) return;

      // Relay hover from the whole control once the lazy player has mounted its SVG.
      function play() {
        if (!layer?.firstElementChild) return false;
        layer.dispatchEvent(new window.MouseEvent(active ? "mouseover" : "mouseout", { bubbles: true }));
        return true;
      }

      if (play()) return;
      const observer = new MutationObserver(() => { if (play()) observer.disconnect(); });
      observer.observe(layer, { childList: true });
      return () => observer.disconnect();
    }, [active, motion]);

    const Player = motion?.Player;
    return (
      <svg
        aria-hidden={props["aria-label"] || props["aria-labelledby"] ? undefined : true}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        ref={icon}
        className={cn("site-icon", className)}
        data-icon-hover={active && !load ? "" : undefined}
      >
        <use href={`/interface-icons.svg#${name}`} width="24" height="24" />
        {children}
        {Player && motion && (
          <Player
            animation={motion.animation}
            interaction="hover"
            render={(events, layer) => (
              <g
                aria-hidden
                className="site-icon-animation"
                data-useanimations=""
                fill="none"
                stroke="none"
                ref={layer.ref as unknown as Ref<SVGGElement>}
                onMouseEnter={(event) => events.onMouseEnter(event as unknown as MouseEvent<HTMLElement>)}
                onMouseLeave={(event) => events.onMouseLeave(event as unknown as MouseEvent<HTMLElement>)}
              />
            )}
          />
        )}
      </svg>
    );
  };
}

export const ArrowUp = createIcon("arrow-up");
export const ArrowUpRight = createIcon("arrow-up-right", () => import("react-useanimations/lib/arrowUpRight"));
export const Calendar = createIcon("calendar", () => import("react-useanimations/lib/calendar"));
export const Check = createIcon("check", () => import("react-useanimations/lib/check"));
export const CheckIcon = Check;
export const ChevronDown = createIcon("chevron-down", () => import("react-useanimations/lib/chevronDown"));
export const ChevronLeft = createIcon("chevron-left", () => import("react-useanimations/lib/chevronLeft"));
export const ChevronRight = createIcon("chevron-right", () => import("react-useanimations/lib/chevronRight"));
export const ChevronRightIcon = ChevronRight;
export const ChevronUp = createIcon("chevron-up", () => import("react-useanimations/lib/chevronUp"));
export const Clock = createIcon("clock", () => import("react-useanimations/lib/clock"));
export const Code2 = createIcon("code", () => import("react-useanimations/lib/code"));
export const Component = createIcon("component");
export const Copy = createIcon("copy", () => import("react-useanimations/lib/copy"));
export const FileText = createIcon("file-text", () => import("react-useanimations/lib/fileText"));
export const FolderGit2 = createIcon("folder", () => import("react-useanimations/lib/folder"));
export const GithubIcon = createIcon("github", () => import("react-useanimations/lib/github"));
export const ImageDown = createIcon("download", () => import("react-useanimations/lib/download"));
export const Languages = createIcon("globe", () => import("react-useanimations/lib/globe"));
export const Link2 = createIcon("link-2", () => import("react-useanimations/lib/link2"));
export const Mail = createIcon("mail", () => import("react-useanimations/lib/mail"));
export const Menu = createIcon("menu", () => import("react-useanimations/lib/menu"));
export const Monitor = createIcon("monitor", () => import("react-useanimations/lib/monitor"));
export const Moon = createIcon("moon", () => import("react-useanimations/lib/moon"));
export const Pause = createIcon("pause");
export const Play = createIcon("play");
export const QrCode = createIcon("qr-code");
export const Quote = createIcon("quote");
export const Rss = createIcon("rss", () => import("react-useanimations/lib/rss"));
export const Search = createIcon("search", () => import("react-useanimations/lib/searchToX"));
export const SearchIcon = Search;
export const SlidersHorizontal = createIcon("sliders", () => import("react-useanimations/lib/settings2"));
export const Sparkles = createIcon("sparkles");
export const SquarePlay = createIcon("square-play");
export const Sun = createIcon("sun", () => import("react-useanimations/lib/sun"));
export const Target = createIcon("target", () => import("react-useanimations/lib/target"));
export const Terminal = createIcon("terminal", () => import("react-useanimations/lib/terminal"));
export const Trophy = createIcon("award", () => import("react-useanimations/lib/award"));
export const User = createIcon("user", () => import("react-useanimations/lib/user"));
export const XIcon = createIcon("x");
