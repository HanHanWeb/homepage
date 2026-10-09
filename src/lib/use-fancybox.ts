"use client";

import { useEffect } from "react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

// 同页可能有多个板块用到灯箱，用引用计数保证只绑定/销毁一次
let bindCount = 0;

/** 启用 data-fancybox 灯箱；多处调用共享同一次绑定 */
export function useFancybox() {
  useEffect(() => {
    bindCount += 1;
    if (bindCount === 1) {
      Fancybox.bind("[data-fancybox]");
    }
    return () => {
      bindCount -= 1;
      if (bindCount === 0) {
        Fancybox.destroy();
      }
    };
  }, []);
}