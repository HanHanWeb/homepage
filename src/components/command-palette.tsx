"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CommandPaletteDialog = dynamic(
  () => import("@/components/command-palette-dialog").then((module) => module.CommandPaletteDialog),
  { ssr: false },
);

export function CommandPalette() {
  const [requested, setRequested] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setRequested(true);
      setOpen((value) => !value);
    };
    const show = () => {
      setRequested(true);
      setOpen(true);
    };
    document.addEventListener("open-command-palette", show);
    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("open-command-palette", show);
      document.removeEventListener("keydown", down);
    };
  }, []);

  return requested ? <CommandPaletteDialog open={open} onOpenChange={setOpen} /> : null;
}
