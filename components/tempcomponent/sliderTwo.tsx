'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

interface Field {
  name: string;
  url?: string;
}

export default function SliderTwo({ data }: { data: any }) {
  const defaultImage = "https://lh3.googleusercontent.com/hzTpTV1Qwyi4crcaB_lEaRTg603ttzm_6Uw8SwBC-iQ9-PeWdFdNpejyPzFdVqWLBjf8o58sDjs8M9wV01MCyjJ3XX6GBIiUrLRiQi9ui8m0tp0";

  // Find image fields
  const imageFields = data.filter((f: Field) => f.name === "image");

  // Prepare slides with fallback
  const slides =
    imageFields.length > 0
      ? imageFields.map((img: Field, index: number) => ({
          id: index + 1,
          image: img?.url && img.url !== "" ? img.url : defaultImage,
        }))
      : [
          {
            id: 1,
            image: defaultImage,
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
        <SwiperSlide key={item.id}>
          {/* PERFECT SQUARE BOX */}
          <div className="w-[300px] h-[300px] mx-auto relative">
            <img
              src={item.image}
              className="w-full h-full object-cover rounded-xl"
              alt="slide image"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
