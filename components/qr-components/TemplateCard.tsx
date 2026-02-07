// components/qr-components/TemplateCard.tsx
"use client";

import { QRTemplate, Tag } from "@/lib/types/qr.types";
import { QRCodeSVG } from "qrcode.react";

interface TemplateCardProps {
  template: QRTemplate;
  isSelected: boolean;
  onClick: () => void;
}

export default function TemplateCard({
  template,
  isSelected,
  onClick,
}: TemplateCardProps) {
  const enabledTags = template.tags.filter((t) => t.enabled);

  const topTags = enabledTags.filter((t) => t.position === "top");
  const bottomTags = enabledTags.filter((t) => t.position === "bottom");
  const leftTags = enabledTags.filter((t) => t.position === "left");
  const rightTags = enabledTags.filter((t) => t.position === "right");

  const previewSize = 140; // good balance — visible but not too big in grid

  return (
    <div
      onClick={onClick}
      className={`
        group relative flex flex-col items-center
        p-4 rounded-xl  cursor-pointer select-none overflow-hidden
        transition-all duration-200 ease-out
       
        ${
          isSelected
            ? "border-2 border-indigo-600 bg-indigo-50/70  ring-2 ring-indigo-300/50"
            : "border-gray-200 bg-white"
        }
      `}
      style={{ width: previewSize + 80 }} // enough space for side tags
    >
      {/* Template Name */}
      <div className="mb-3 text-sm font-semibold text-gray-900 text-center truncate w-full">
        {template.name}
      </div>

      {/* QR Preview with surrounding tags */}
      <div
        className="relative mb-4"
        style={{
          width: previewSize + 60,
          height: previewSize + 60,
        }}
      >
        {/* Background container */}
        <div
          className="absolute inset-0 rounded-xl shadow-sm"
          style={{
            backgroundColor: template.backgroundColor || "#ffffff",
          }}
        />

        {/* Top tags */}
        {topTags.length > 0 && (
          <div className="absolute top-0 left-0 right-0 flex justify-center gap-1.5 px-2 pt-1.5 flex-wrap">
            {topTags.map((tag) => (
              <TagLabel key={tag.id} tag={tag} />
            ))}
          </div>
        )}

        {/* Left tags */}
        {leftTags.length > 0 && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 pl-2">
            {leftTags.map((tag) => (
              <TagLabel key={tag.id} tag={tag} vertical />
            ))}
          </div>
        )}

        {/* Right tags */}
        {rightTags.length > 0 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 pr-2">
            {rightTags.map((tag) => (
              <TagLabel key={tag.id} tag={tag} vertical />
            ))}
          </div>
        )}

        {/* Center QR */}
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <div
            className="bg-white rounded-lg shadow-inner overflow-hidden"
            style={{
              width: previewSize,
              height: previewSize,
            }}
          >
            <QRCodeSVG
              value="https://example.com/preview"
              size={previewSize}
              bgColor={template.backgroundColor || "#ffffff"}
              fgColor={template.textColor || "#000000"}
              level="M"
              includeMargin={false}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* Bottom tags */}
        {bottomTags.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 px-2 pb-1.5 flex-wrap">
            {bottomTags.map((tag) => (
              <TagLabel key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="font-medium">Tags:</span>
          <span className="px-2 py-0.5 bg-gray-100 rounded-full font-medium">
            {enabledTags.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-medium">Size:</span>
          <span className="px-2 py-0.5 bg-gray-100 rounded-full font-medium">
            {template.qrSize}
          </span>
        </div>
      </div>

      {/* Selected badge */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow border-2 border-white">
          ✓ Selected
        </div>
      )}
    </div>
  );
}

// Small reusable tag label component
function TagLabel({ tag, vertical = false }: { tag: Tag; vertical?: boolean }) {
  const style = vertical
    ? {
        writingMode: "vertical-rl" as const,
        textOrientation: "mixed" as const,
        transform: "rotate(180deg)",
      }
    : {};

  return (
    <div
      className={`
        text-[10px] font-medium px-1.5 py-0.5 rounded 
        bg-black/70 text-white whitespace-nowrap overflow-hidden text-ellipsis
        max-w-[80px] shadow-sm
      `}
      style={style}
      title={tag.label || tag.value} // tooltip on hover if truncated
    >
      {tag.label || tag.value || "Tag"}
    </div>
  );
}