"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import Preview from "@/app/preview/dummuypreview/page";

export default function LandingPageClient({ slug }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [payload, setPayload] = React.useState(null);
  const [productId, setproductId] = React.useState(null);
  React.useEffect(() => {

    // if (!slug || isNaN(slug)) {
    //   setIsLoading(false);
    //   return;
    // }

    const fetchPreviewData = async () => {
      try {
        setIsLoading(true);

        const res = await axiosClient.get(`public/products/${slug}/landing-page`);
           console.log("Landing Page Data:", res.data);
        if (res.data?.success && res.data?.data?.sections?.length > 0) {
          setproductId(res.data?.data?.product_id);
          const activeSections = res.data.data.sections
            .filter((sec) => sec.is_published)
            .sort((a, b) => a.sort_order - b.sort_order);

          setPayload({
            templateName: "modern",
            sections: activeSections.map((sec) => ({
              section: sec.global_section.key,
              content: sec.content ?? {},
            })),
            styles: {
              primaryColor: "#ecedf4ff",
              backgroundColor: "#000000",
              textColor: "#a97d38",
              headlineSize: 28,
              paragraphSize: 16,
            },
          });
        } else {
          // No published sections
          setPayload({
            templateName: "modern",
            sections: [
              {
                section: "hero",
                content: {
                  title: "No Sections Published",
                  subtitle: "Enable sections in the builder to see them here.",
                },
              },
            ],
            styles: {
              primaryColor: "#ecedf4ff",
              backgroundColor: "#000000",
              textColor: "#a97d38",
              headlineSize: 28,
              paragraphSize: 16,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching landing page data:", error);


        setPayload({
          templateName: "modern",
          sections: [
            {
              section: "hero",
              content: {
                title: "Error Loading Preview",
                subtitle: "Something went wrong. Please try again later.",
              },
            },
          ],
          styles: {
            primaryColor: "#ecedf4ff",
            backgroundColor: "#000000",
            textColor: "#a97d38",
            headlineSize: 28,
            paragraphSize: 16,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreviewData();
  }, [slug]);


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-gray-600" />
      </div>
    );
  }


  if (!payload) {
    return (
      <div className="p-8 text-center text-gray-600">
        No preview data available.
      </div>
    );
  }


  return <Preview data={payload} productId={productId}  />;
}