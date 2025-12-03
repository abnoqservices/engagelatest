"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Field {
  name: string;
  url?: string;
  value?: string;
}

export default function sliderThree({ data }: { data: any }) {


  // Extract images
  const imageFields = data.filter((f) => f.name === "image");

  // Extract title/subtitle
  const titleField = data.find((f) => f.name === "title");
  const subtitleField = data.find((f) => f.name === "subtitle");

  const title = titleField?.value || "";
  const subtitle = subtitleField?.value || "";

  // Slides preparation
  const slides =
    imageFields.length > 0
      ? imageFields.map((img, index) => ({
          id: index + 1,
          image: img?.url || "https://lh3.googleusercontent.com/hzTpTV1Qwyi4crcaB_lEaRTg603ttzm_6Uw8SwBC-iQ9-PeWdFdNpejyPzFdVqWLBjf8o58sDjs8M9wV01MCyjJ3XX6GBIiUrLRiQi9ui8m0tp0",
          title,
          subtitle,
        }))
      : [
          {
            id: 1,
            image: "https://lh3.googleusercontent.com/hzTpTV1Qwyi4crcaB_lEaRTg603ttzm_6Uw8SwBC-iQ9-PeWdFdNpejyPzFdVqWLBjf8o58sDjs8M9wV01MCyjJ3XX6GBIiUrLRiQi9ui8m0tp0",
            title,
            subtitle,
          },
        ];

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500 }}
        loop
      >
        {slides.map((item) => (
          <SwiperSlide key={item.id}>
            {/* 1:1 PERFECT SQUARE CONTAINER */}
            <div className="relative w-full max-w-[400px] mx-auto aspect-square">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded-xl"
              />

              {(item.title || item.subtitle) && (
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white drop-shadow-lg text-center w-auto px-4 py-2 bg-black/40 rounded-lg inline-block">
             <h2 className="text-2xl font-bold">{item.title}</h2>
             <p className="text-lg">{item.subtitle}</p>
           </div>
           
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
