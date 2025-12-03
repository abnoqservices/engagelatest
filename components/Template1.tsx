import React from "react";
import { SECTION_COMPONENTS } from "@/components/tempcomponent";

interface SectionData {
  section: string;
  enabled?: boolean;
  fields?: any; // or define proper type if you know it
}

interface Template1Props {
  data?: {
    sections?: SectionData[];
  };
}

const Template1: React.FC<Template1Props> = ({ data }) => {
  return (
    <div className="min-h-screen bg-white">
      {data?.sections?.map((item, index) => {
        const Component = SECTION_COMPONENTS[item.section];

        if (!Component) {
          return (
            <p key={index} className="text-red-500 p-4">
              Component "{item.section}" not found.
            </p>
          );
        }

        return (
          <Component
            key={index}
            data={item.fields}
            enabled={item.enabled}
          />
        );
      })}
    </div>
  );
};

export default Template1;
