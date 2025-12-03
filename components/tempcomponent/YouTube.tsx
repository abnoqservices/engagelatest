import React from "react";

export default function YouTube({ videoId }: { videoId: string }) {
  return (
    <div className="w-full aspect-video relative">
      <iframe 
        src={`https://www.youtube.com/embed/O-JXUhhIRHU`}
        className="card-header absolute top-0 left-0 w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
