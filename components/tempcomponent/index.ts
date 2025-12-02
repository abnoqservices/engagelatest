"use client";

import dynamic from "next/dynamic";

/**
 * Load all section components client-side only
 * This avoids SSR issues with sliders, window, YouTube, etc.
 */
export const SECTION_COMPONENTS: Record<string, any> = {
  Header: dynamic(() => import("./Header"), { ssr: false }),
  slider: dynamic(() => import("./slider"), { ssr: false }),
  sliderTwo: dynamic(() => import("./sliderTwo"), { ssr: false }),
  sliderThree: dynamic(() => import("./sliderThree"), { ssr: false }),
  Description: dynamic(() => import("./Description"), { ssr: false }),
  Specification: dynamic(() => import("./Specification"), { ssr: false }),
  YouTube: dynamic(() => import("./YouTube"), { ssr: false }),
  CTA: dynamic(() => import("./CTA"), { ssr: false }),
  Social: dynamic(() => import("./Social"), { ssr: false }),
  Contact: dynamic(() => import("./Contact"), { ssr: false }),
};
