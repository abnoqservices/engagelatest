import React from "react";

export default function YouTube({ data }: { data: any[] }) {

  // Find the field
  const videoField = data?.find((f) => f.name === "videoUrl");
  const videoUrl = videoField?.value || "";

  // Convert YouTube link to embed link
  const getEmbedUrl = (url: string) => {
    if (!url) return "";

    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="card-header  aspect-video relative rounded-lg overflow-hidden">
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
