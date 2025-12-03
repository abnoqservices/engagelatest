"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const DEFAULT_IMAGE = "https://lh3.googleusercontent.com/hzTpTV1Qwyi4crcaB_lEaRTg603ttzm_6Uw8SwBC-iQ9-PeWdFdNpejyPzFdVqWLBjf8o58sDjs8M9wV01MCyjJ3XX6GBIiUrLRiQi9ui8m0tp0"; // 1080x1080 default image

export default function Slider({ data }: { data: any[] }) {
  const slides = data.map((item, index) => ({
    id: index + 1,
    image: item.url && item.url.trim() !== "" ? item.url : DEFAULT_IMAGE,
  }));

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <Swiper
        loop={true}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
      >
        {slides.map((item) => (
          <SwiperSlide key={item.id}>
            {/* SQUARE CONTAINER */}
            <div className="relative w-full max-w-[400px] mx-auto aspect-square">
              <img
                src={item.image}
                alt="Slide Image"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
