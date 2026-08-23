"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { SocialLink } from "@/components/dock-bar";

/** 社交链接 + radix 悬停提示——按需加载的分包,光标进入 Dock 后才挂载 */
export default function SocialLinkWithTip({
  social,
}: {
  social: Parameters<typeof SocialLink>[0]["social"];
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <SocialLink social={social} />
      </TooltipTrigger>
      <TooltipContent>
        <p>{social.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}
