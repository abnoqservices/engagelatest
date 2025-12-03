import React from 'react';

export default function Description({ data }: { data: any[] }) {

  const headingField = data?.find((field) => field.name === "heading");
  const descriptionField = data?.find((field) => field.name === "description");

  const heading = headingField?.value || "Your Brand Name";
  const description = descriptionField?.value || "Your description goes here.";

  return (
    <div className="card-header">

      {/* Heading */}
      <h2 className="core-header-title">
        {heading}
      </h2>
      <div className="w-12 h-1 bg-gray-100 mx-auto mb-4 rounded-full"></div>
      {/* Description (clean + left aligned + centered container) */}
      <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto text-left">
        {description}
      </p>

    </div>
  );
}
