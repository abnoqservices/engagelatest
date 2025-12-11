"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface TestimonialItem {
  image?: string;
  name?: string;
  designation?: string;
  rating?: string | number;
  description?: string;
}

interface Field {
  name: string;
  items?: TestimonialItem[];
}

export default function TestimonialSlider({ data }: { data: Field[] }) {
  const DEFAULT_IMAGE =
    "https://lh3.googleusercontent.com/hzTpTV1Qwyi4crcaB_lEaRTg603ttzm_6Uw8SwBC-iQ9-PeWdFdNpejyPzFdVqWLBjf8o58sDjs8M9wV01MCyjJ3XX6GBIiUrLRiQi9ui8m0tp0";

  // 1️⃣ Locate the testimonial field
  const testimonialField = data.find((f) => f.name === "Testimonial");

  // 2️⃣ Extract items (array of testimonials)
  const items = testimonialField?.items || [];

  // 3️⃣ Prepare slides
  const slides = items.length > 0 ? items.map((item, index) => ({
          id: index + 1,
          image: item.image || DEFAULT_IMAGE,
          name: item.name || "John Doe",
          designation: item.designation || "Customer",
          rating: Number(item.rating) || 5,
          description:
            item.description ||
            "This is an amazing service! It exceeded all my expectations!",
        }))
      : [
          {
            id: 1,
            image: DEFAULT_IMAGE,
            name: "John Doe",
            designation: "Customer",
            rating: 5,
            description:
              "This is an amazing service! It exceeded all my expectations!",
          },
        ];

  return (
    <div className="card-header">
      <Swiper
        modules={[ Autoplay]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500 }}
        loop
      >
        {slides.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="rounded-2xl   flex flex-col items-center text-center gap-4 max-w-[400px] mx-auto">
              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
              />

              {/* NAME + DESIGNATION */}
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.designation}</p>
              </div>

              {/* RATING */}
              <div className="flex gap-1 text-yellow-400 text-lg">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>

              {/* DESCRIPTION */}
              <p className="text-gray-600 text-sm leading-relaxed px-4">
                {item.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
