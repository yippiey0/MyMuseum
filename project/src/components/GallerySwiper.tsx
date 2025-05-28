import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// images: массив строк (URL), captions: массив подписей
interface GallerySwiperProps {
  images: string[];
  captions?: string[];
  initialIndex?: number;
}

export const GallerySwiper: React.FC<GallerySwiperProps> = ({ images, captions = [] }) => (
  <Swiper
    modules={[Navigation, Pagination, Keyboard]}
    navigation
    pagination={{ clickable: true }}
    keyboard={{ enabled: true }}
    spaceBetween={30}
    slidesPerView={1}
    style={{ borderRadius: 12, boxShadow: "0 2px 12px #0002" }}
  >
    {images.map((url, idx) => (
      <SwiperSlide key={url}>
        <div style={{ width: "100%", height: 450, background: "#222" }}>
          <img
            src={url}
            alt={`slide-${idx}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "#222",
              borderRadius: 12,
            }}
          />
          {captions[idx] && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                color: "#fff",
                background: "rgba(0,0,0,0.5)",
                padding: "12px 16px",
                fontSize: "1rem",
              }}
            >
              {captions[idx]}
            </div>
          )}
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);