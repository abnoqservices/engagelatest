"use client";
import React from "react";
import dynamic from "next/dynamic";

const Template1 = ({ data }) => {
  return (
    <div className="min-h-screen bg-white">
      {data?.sections?.map((item, index) => {
        const SectionName = item.section;

        // Dynamically load component
        const Component = dynamic(
          () => import(`@/components/tempcomponent/${SectionName}.tsx`),
          { ssr: false, loading: () => <p>Loading {SectionName}...</p> }
        );

        return (
          <Component
            key={index}
            data={item.fields}
           
          />
        );
      })}
    </div>
  );
};

export default Template1;