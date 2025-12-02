"use client";
import React from "react";
import Template1 from "@/components/Template1";
import Template2 from "@/components/Template2";

// 👉 Create a Type for the expected data structure
interface PreviewData {
  templateName: string;
  sections?: any[];
  [key: string]: any; // allow extra fields
}

interface PerviewProps {
  data: PreviewData; // ← assign type to props
}

const Perview: React.FC<PerviewProps> = ({ data }) => {
  function getTemplateComponent(type: string) {
    switch (type) {
      case "modern":
        return Template1;
      case "basic":
        return Template2;
      default:
        return null;
    }
  }
console.log(data);

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
