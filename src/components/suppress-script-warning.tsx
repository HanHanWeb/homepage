"use client";

import { useEffect } from "react";

export function SuppressScriptWarning() {
  useEffect(() => {
    const orig = console.error;
    console.error = (...args: unknown[]) => {
      const first = args[0];
      if (typeof first === "string" && first.includes("Encountered a script tag")) return;
      orig(...(args as Parameters<typeof console.error>));
    };
    return () => {
      console.error = orig;
    };
  }, []);
  return null;
}
