"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import axiosClient from "@/lib/axiosClient";

const DEFAULT_IMAGE =
  "https://lh3.googleusercontent.com/hzTpTV1Qwyi4crcaB_lEaRTg603ttzm_6Uw8SwBC-iQ9-PeWdFdNpejyPzFdVqWLBjf8o58sDjs8M9wV01MCyjJ3XX6GBIiUrLRiQi9ui8m0tp0";

interface GalleryImage {
  id: number;
  url: string;
  position: number;
}

interface SliderProps {
  productId: number;
  product_gallery?: boolean; // Made optional and default to true
}

export default function Slider({ productId, product_gallery = true }: SliderProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // All hooks are called unconditionally — this is REQUIRED

  useEffect(() => {
    const fetchImages = async () => {
      if (!productId) {
        setImages([{ id: 0, url: DEFAULT_IMAGE, position: 1 }]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await axiosClient.get("/product-images", {
          params: { product_id: productId },
        });

        if (!res.data?.success) {
          throw new Error(res.data?.message || "API returned success: false");
        }

        const galleryImages = (res.data.data || [])
          .filter((item: any) => item.type === "gallery" && item.url?.trim())
          .map((item: any) => ({
            id: item.id,
            url: item.url.trim(),
            position: item.position ?? 999,
          }))
          .sort((a: any, b: any) => a.position - b.position);

        setImages(
          galleryImages.length > 0
            ? galleryImages
            : [{ id: 0, url: DEFAULT_IMAGE, position: 1 }]
        );
      } catch (err: any) {
        console.error("Error fetching images:", err);
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to load product images";
        setError(message);
        setImages([{ id: 0, url: DEFAULT_IMAGE, position: 1 }]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if gallery is enabled
    if (product_gallery) {
      fetchImages();
    } else {
      setImages([]);
      setLoading(false);
    }
  }, [productId, product_gallery]);

  // Now safely hide the slider if product_gallery is false
  if (!product_gallery) {
    return null;
  }

  // Show loading
  if (loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto aspect-square flex items-center justify-center bg-muted rounded-xl">
        <p className="text-muted-foreground">Loading images...</p>
      </div>
    );
  }

  // Show error
  if (error) {
    return (
      <div className="w-full max-w-[1200px] mx-auto aspect-square flex items-center justify-center bg-destructive/10 rounded-xl">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  // No images fallback
  if (images.length === 0) {
    return null; // or show a placeholder if you want
  }
//max-w-[400px]
  return (
    <div className="card-header-slider">
      <Swiper
        modules={[Pagination, Autoplay]}
        loop={images.length > 1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        spaceBetween={20}
        className="pb-10"
      >
        {images.map((img) => (
          <SwiperSlide key={img.id}>
            <div className="relative w-full  mx-auto aspect-square">
              <img
                src={img.url}
                alt="Product gallery image"
                className="w-full h-full object-cover rounded-xl "
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}