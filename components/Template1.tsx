"use client";

import React from "react";
import { SECTION_COMPONENTS } from "@/components/tempcomponent";

const Template1 = ({ data }) => {
  return (
    <div className="min-h-screen bg-white">
      {data?.sections?.map((item, index) => {
        const Component = SECTION_COMPONENTS[item.section];

        if (!Component) {
          return (
            <div key={index} className="p-4 text-red-600">
              ⚠️ Component "{item.section}" not found.
            </div>
          );
        }

        return (
          item.enabled && (
            <Component key={item.section} data={item.fields} />

          )
        );
      })}
    </div>
  );
};

export default Template1;
