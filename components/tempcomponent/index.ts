"use client";

import dynamic from "next/dynamic";

/**
 * Load all section components client-side only
 * This avoids SSR issues with sliders, window, YouTube, etc.
 */
export const SECTION_COMPONENTS: Record<string, any> = {
  Header: dynamic(() => import("./Header"), { ssr: true }),
  slider: dynamic(() => import("./slider"), { ssr: true }),
   sliderTwo: dynamic(() => import("./sliderTwo"), { ssr: true }),
   sliderThree: dynamic(() => import("./sliderThree"), { ssr: true }),
  Description: dynamic(() => import("./Description"), { ssr: true }),
  Pheader: dynamic(() => import("./Pheader"), { ssr: true }),
  Propheader: dynamic(() => import("./Propheader"), { ssr: true }),

  
  // Specification: dynamic(() => import("./Specification"), { ssr: true }),
   YouTube: dynamic(() => import("./YouTube"), { ssr: true }),
  // CTA: dynamic(() => import("./CTA"), { ssr: true }),
  Social: dynamic(() => import("./Social"), { ssr: true }),
   Contact: dynamic(() => import("./Contact"), { ssr: true }),
  // Testimonial: dynamic(() => import("./Testimonial"), { ssr: true }),
  // ProductDetail: dynamic(() => import("./ProductDetail"), { ssr: true })
};
