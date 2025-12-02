'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
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

const SliderTwo: React.FC<SliderProps> = () => {
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
    <Swiper
      effect="coverflow"
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={"auto"}
      loop={true}
      autoplay={{ delay: 3000 }}
      coverflowEffect={{
        rotate: 50,
        stretch: 30,
        depth: 350,
        modifier: 19,
        slideShadows: true,
      }}
      pagination={{ clickable: true }}
      modules={[EffectCoverflow, Autoplay, Pagination]}
      className="w-full max-w-[900px]"
    >
      {slides.map((item) => (
        <SwiperSlide
          key={item.id}
          style={{ width: "300px", height: "350px" }}
        >
          <img
            src={item.image}
            className="w-full h-full object-cover rounded-xl"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
export default SliderTwo;
