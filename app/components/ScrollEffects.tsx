"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import AOS from "aos";

export function ScrollEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    AOS.init({
      once: false,
      mirror: true,
      duration: 750,
      offset: 56,
      easing: "ease-out-cubic",
      disable: reduceMotion,
    });

    if (reduceMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.25,
      autoRaf: true,
    });

    const onResize = () => {
      lenis.resize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      lenis.stop();
      lenis.destroy();
    };
  }, []);

  return null;
}
