"use client";

import { useEffect, useState } from "react";

// Treats "desktop" as a device with a fine pointer + real hover support
// (mouse/trackpad). Touch devices — including large tablets — get the
// tap-to-expand behavior instead of hover-to-expand.
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}
