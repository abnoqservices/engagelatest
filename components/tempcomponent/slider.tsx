"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface SlideItem {
  id: string | number;
  image: string;
  title?: string;
  subtitle?: string;
}

interface SliderProps {
  slides: SlideItem[];
}

const Slider: React.FC<SliderProps> = () => {
  const slides = [
  {
    id: 1,
    image: "/F1.jpg",
    title: "Modern Design",
    subtitle: "Beautiful layouts for your landing page",
  },
  {
    id: 2,
    image: "/F2.jpg",
    title: "High Performance",
    subtitle: "Fast and optimized loading speed",
  },
  {
    id: 3,
    image: "/F3.jpg",
    title: "Mobile Friendly",
    subtitle: "Fully responsive on all devices",
  },
];

  return (
    <div className="w-full max-w-[1200px] mx-auto">
 <Swiper
  effect="fade"
  fadeEffect={{ crossFade: true }}
  loop={true}
  autoplay={{ delay: 3000 }}
  pagination={{ clickable: true }}
 
>
  {slides.map((item) => (
    <SwiperSlide key={item.id}>
               <div className="relative w-full ">
                 <img
                   src={item.image}
                   alt={item.title}
                   className="w-full h-full object-cover rounded-xl"
                 />
   
                 {(item.title || item.subtitle) && (
                   <div className="absolute bottom-6 left-6 text-white drop-shadow-lg">
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
};

export default Slider;
