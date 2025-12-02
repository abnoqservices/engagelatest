"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function LandingClientInit() {
  useEffect(() => {
    // wait a tick to let external scripts load
    const t = setTimeout(() => {
      // initialize AOS if available
      try {
        // @ts-ignore
        if (window.AOS) window.AOS.init();
      } catch (e) { /* ignore */ }

      // init Swiper sliders if available
      try {
        // @ts-ignore
        if (window.Swiper) {
          // init product thumb slider
          // @ts-ignore
          new window.Swiper(".single-product-thumb-slider", {
            loop: true,
            spaceBetween: 10,
            pagination: { el: ".swiper-pagination", clickable: true }
          });
          // @ts-ignore
          new window.Swiper(".single-product-nav-slider", {
            loop: true,
            slidesPerView: 4,
            spaceBetween: 10,
            centeredSlides: false
          });
        }
      } catch (e) {
        // ignore init errors
      }

      // optionally call any global init from custom.js
      try {
        // @ts-ignore
        if (typeof (window as any).initCustomScripts === "function") (window as any).initCustomScripts();
      } catch (e) {}
    }, 400);

    return () => clearTimeout(t);
  }, []);

  // also include Script tags to load libs when this React component is active
  return (
    <>
      <Script src="/premium-landing/jquery-main.js" strategy="afterInteractive" />
      <Script src="/premium-landing/bootstrap.min.js" strategy="afterInteractive" />
      <Script src="/premium-landing/swiper.min.js" strategy="afterInteractive" />
      <Script src="/premium-landing/fancybox.min.js" strategy="afterInteractive" />
      <Script src="/premium-landing/aos.min.js" strategy="afterInteractive" />
      <Script src="/premium-landing/custom.js" strategy="afterInteractive" />
    </>
  );
}
