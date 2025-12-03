import React from "react";

export default function Header({ data }: { data: any[] }) {
  // Find logo (has "url") and title (has "name" and "value")
  const logoField = data?.find((field: any) => field.url);
  const titleField = data?.find((field: any) => field.name === "title");

  const logoUrl = logoField?.url || "/F1.jpg"; // fallback image
  const title = titleField?.value || "Your Brand Name";
  const subtitleField = data?.find((field: any) => field.name === "subtitle");
  const subtitle=subtitleField?.value || "Your subtitle text goes here. This can be one or two lines long.";
  return ( 
    <div className=" flex flex-col items-center text-center py-6 px-4">

    {/* Shadow Wrapper */}
    <div className="rounded-full shadow-xl p-1 mb-4">
      <div className="w-24 h-24 rounded-full overflow-hidden">
        <img
          src={logoUrl}
          alt="Brand Logo"
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = "/fallback-logo.png")}
        />
      </div>
    </div>
  
    {/* Title */}
    <h1 className="text-3xl font-bold text-gray-900 mb-2">
      {title}
    </h1>
  
    {/* Subtitle */}
    <p className="text-gray-600 text-base leading-relaxed max-w-md">
      {subtitle}
    </p>
  </div>
  

  );
}