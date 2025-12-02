"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically load templates (avoids SSR issues)
const Template1 = dynamic(() => import("@/components/Template1"), { ssr: false });
const Template2 = dynamic(() => import("@/components/Template2"), { ssr: false });

interface PreviewData {
  templateName: string;
  sections?: any[];
  [key: string]: any;
}

interface PerviewProps {
  data: PreviewData;
}

const Perview: React.FC<PerviewProps> = ({ data }) => {
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

  const ContentComponent = getTemplateComponent(data.templateName);

  return (
    <div>
      {ContentComponent ? (
        <ContentComponent data={data} />
      ) : (
        <div>No template selected</div>
      )}
    </div>
  );
};

export default Perview;
