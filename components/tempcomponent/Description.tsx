import React from 'react';

export default function Description({ data }: { data: any[] }) {

  const headingField = data?.find((field) => field.name === "heading");
  const descriptionField = data?.find((field) => field.name === "description");

  const heading = headingField?.value || "Your Brand Name";
  const description = descriptionField?.value || "<p>Your description goes here.</p>";

  return (
    <div className="card-header">

      {/* Heading */}
      <h2 className="core-header-title">
        {heading}
      </h2>

      <div className="w-12 h-1 bg-gray-100 mx-auto mb-4 rounded-full"></div>

      {/* Description → Supports bold, italic, button, list, colors, etc. */}
      <div
        className="prose prose-sm md:prose-lg text-gray-700 leading-relaxed max-w-2xl mx-auto"
        dangerouslySetInnerHTML={{ __html: description }}
      ></div>

    </div>
  );
}
