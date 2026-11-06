import type { SVGProps } from "react";

export function UserGroupIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="7" r="3" />
      <circle cx="4.75" cy="9" r="2.25" />
      <circle cx="19.25" cy="9" r="2.25" />
      <path d="M6.5 20v-1.5a5.5 5.5 0 0 1 11 0V20H6.5Z" />
      <path d="M6.5 14.2A3.75 3.75 0 0 0 1 17.5V19h3M17.5 14.2a3.75 3.75 0 0 1 5.5 3.3V19h-3" />
    </svg>
  );
}
