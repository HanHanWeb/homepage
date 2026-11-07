import { cn } from "@/lib/utils";

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <span
      role={label ? "progressbar" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("relative inline-flex size-5 shrink-0", className)}
    >
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className="absolute inset-0 size-full">
        <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="2.5" opacity=".16" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        className="absolute inset-0 size-full animate-spin overflow-visible [animation-duration:900ms] motion-reduce:animate-none"
      >
        <path d="M5.46 5.46A9.25 9.25 0 0 1 21.25 12" strokeWidth="4" className="opacity-35 blur-[3px]" />
        <path d="M8.46 3.45A9.25 9.25 0 0 1 21.25 12" strokeWidth="3" className="opacity-60 blur-[1px]" />
        <path d="M12 2.75A9.25 9.25 0 0 1 21.25 12" strokeWidth="2.5" />
      </svg>
    </span>
  );
}
