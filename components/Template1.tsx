"use client";

import React from "react";
import { SECTION_COMPONENTS } from "@/components/tempcomponent";

const Template1: React.FC<{ data: any; productId: number }> = ({ data, productId }) => {
  const { sections = [], styles = {} } = data;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-1 py-2">
        {sections
          .filter((s: any) => s.content !== undefined)
          .map((item: any, index: number) => {
            const Component = SECTION_COMPONENTS[item.section];

            if (!Component) {
              console.warn(`Missing component for section: ${item.section}`);
              return null;
            }

            // Pass both the content AND the productId
            return (
              <Component
                key={`${item.section}-${index}`}
                {...item.content}
                productId={productId}  // ← This is the key addition
              />
            );
          })}
      </div>
    </div>
  );
};

export default Template1;