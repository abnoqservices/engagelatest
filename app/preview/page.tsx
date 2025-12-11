"use client";

"use client";
export const dynamic = "force-dynamic"; // OK now

import React from "react";
import nextDynamic from "next/dynamic"; // renamed import
import { Skeleton } from "@/components/ui/skeleton";

const Template1 = nextDynamic(() => import("@/components/Template1"), {
  ssr: true,
  loading: () => null,
});

const Template2 = nextDynamic(() => import("@/components/Template2"), {
  ssr: true,
  loading: () => null,
});


interface PreviewData {
  templateName: string;
  sections?: any[];
  [key: string]: any;
}

interface PreviewProps {
  data?: PreviewData; // <- allow undefined
}

const Preview: React.FC<PreviewProps> = ({ data }) => {
  const [localLoading, setLocalLoading] = React.useState(false);

  // If data is undefined, stop rendering immediately
  if (!data) {
    return <div>No preview data found</div>;
  }

  const getTemplateComponent = (type: string) => {
    switch (type) {
      case "modern":
        return Template1;
      case "basic":
        return Template2;
      default:
        return null;
    }
  };

  const ContentComponent = React.useMemo(
    () => getTemplateComponent(data?.templateName || ""),
    [data?.templateName]
  );

  React.useEffect(() => {
    setLocalLoading(true);
    const t = setTimeout(() => setLocalLoading(false), 300);
    return () => clearTimeout(t);
  }, [data]);

  return (
    <div className="relative">
      {/* Loader */}
      {localLoading && (
        <div className="relative min-h-screen bg-background">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="rounded-2xl p-8 shadow-1xl animate-pulse">
              <img
                src="https://www.abnoq.com/images/Abnoq-logo.svg"
                alt="Company Logo"
                className="h-16 w-16 object-contain"
              />
            </div>
          </div>

          {/* Skeleton */}
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
              <Skeleton className="h-10 w-[140px]" />
            </div>
          </div>
        </div>
      )}

      {/* Render Template */}
      {ContentComponent ? (
        <ContentComponent data={data} />
      ) : (
        <div>No template selected</div>
      )}
    </div>
  );
};

export default React.memo(Preview);
