// Template1.tsx → Clean version (no <Head> needed)
"use client";

import React from "react";
import { SECTION_COMPONENTS } from "@/components/tempcomponent";

const Template1: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="container mx-auto px-1 py-2">
      {data?.sections
        ?.filter((s: any) => s.enabled !== false)
        .map((item: any, index: number) => {
          const Component = SECTION_COMPONENTS[item.section];
          if (!Component) return null;

          return <Component key={index} data={item.fields} />;
        })}
    </div>
  );
};

export default Template1;