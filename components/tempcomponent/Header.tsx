import React from "react";

export default function Header({ data }: { data: any[] }) {
  // Find logo (has "url") and title (has "name" and "value")
  const logoField = data?.find((field: any) => field.url);
  const titleField = data?.find((field: any) => field.name === "title");

  const logoUrl = logoField?.url || "/F1.jpg"; // fallback image
  const title = titleField?.value || "Your Brand Name";

  return (
    <div className="card-header">
      {/* Dynamic Logo */}
      <img
        src={logoUrl}
        alt="Brand Logo"
        className="card-header-logo"
        onError={(e) => {
          e.currentTarget.src = "/fallback-logo.png"; // fallback if blob fails
        }}
      />

      {/* Dynamic Title */}
      <h1 className="card-header-title">{title}</h1>

      {/* Optional Subtitle (you can add later) */}
      <p className="card-header-subtitle">
        Your subtitle text goes here. This can be one or two lines long.
      </p>
    </div>
  );
}