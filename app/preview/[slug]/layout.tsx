// app/preview/[slug]/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import axiosClient from "@/lib/axiosClient";

export const metadata: Metadata = {
  title: "Landing Page Preview",
  description: "Preview your landing page design",
  robots: { index: false, follow: false },
};

export default async function PreviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = await params; // ← No await here! (important)

  // Fetch tracking IDs from your API
  let productId: number | null = null;
  let eventId: number | null = null;
  let boothId: number | null = null;

  try {
    const res = await axiosClient.get(`public/products/${slug}/landing-page`);

    if (res.data?.success && res.data?.data) {
      const data = res.data.data;
      productId = data.product_id ?? null;
      // Adjust these field names according to your actual API response structure
      eventId = data.event_id ?? null;
      boothId = data.booth_id ?? null;
    }
  } catch (err: any) {
    // Silently handle 404 - product might not exist or not be published yet
    if (err?.response?.status !== 404) {
      console.error("[PreviewLayout] Failed to fetch tracking information:", err);
    }
    // Continue with fallback values
  }

  // Final values with fallback
  const finalProductId = productId ?? null;
  const finalEventId = eventId ?? null;
  const finalBoothId = boothId ?? null;

  // Optional: log for debugging (remove in production)
  console.log("Analytics tracking values:", {
    slug,
    productId: finalProductId,
    eventId: finalEventId,
    boothId: finalBoothId,
  });

  return (
    <>
      {slug && (
        <>
          {/* 1. Load the tracker script */}
          <Script
            src="/landing-page-tracker.js"
            strategy="afterInteractive"
          />

          {/* 2. Safe initialization with retry mechanism */}
          <Script
            id="landing-page-tracker-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function initTracker() {
                  let attempts = 0;
                  const maxAttempts = 40; // ~4 seconds max wait

                  function tryInitialize() {
                    if (typeof LandingPageTracker !== 'undefined') {
                      window.tracker = new LandingPageTracker({
                        slug: "${slug}",
                        productId: ${finalProductId !== null ? finalProductId : 'null'},
                        eventId: ${finalEventId !== null ? finalEventId : 'null'},
                        boothId: ${finalBoothId !== null ? finalBoothId : 'null'},
                        apiBaseUrl: "http://127.0.0.1:8000/api" // ← Change to production URL later
                      });

                      console.log("Analytics tracker initialized successfully", {
                        slug: "${slug}",
                        productId: ${finalProductId},
                        eventId: ${finalEventId},
                        boothId: ${finalBoothId}
                      });

                      // Optional: for manual debugging in console
                      window.trackerDebug = window.tracker;
                    } 
                    else if (attempts < maxAttempts) {
                      attempts++;
                      console.log("Waiting for tracker script... attempt " + attempts);
                      setTimeout(tryInitialize, 100);
                    } 
                    else {
                      console.error("Failed to initialize LandingPageTracker - class not found");
                    }
                  }

                  // Start when DOM is ready
                  if (document.readyState === 'complete' || document.readyState === 'interactive') {
                    tryInitialize();
                  } else {
                    document.addEventListener('DOMContentLoaded', tryInitialize);
                  }
                })();
              `,
            }}
          />
        </>
      )}

      {children}
    </>
  );
}