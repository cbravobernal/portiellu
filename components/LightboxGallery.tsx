"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

type LightboxGalleryProps = {
  title: string;
  images: string[];
  lang?: "es" | "en";
};

export default function LightboxGallery({
  title,
  images,
  lang = "es"
}: LightboxGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const isEn = lang === "en";

  useEffect(() => {
    setMounted(true);
  }, []);

  function showPrev() {
    setActiveIndex((prev) => {
      if (prev === null) return 0;
      return (prev - 1 + images.length) % images.length;
    });
  }

  function showNext() {
    setActiveIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % images.length;
    });
  }

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    setLoadingImage(true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const nextIndex = (activeIndex + 1) % images.length;
    const prevIndex = (activeIndex - 1 + images.length) % images.length;
    const preloads = [images[nextIndex], images[prevIndex]];
    preloads.forEach((src) => {
      const preload = new window.Image();
      preload.src = src;
    });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      } else if (event.key === "ArrowRight") {
        setActiveIndex((prev) => {
          if (prev === null) return 0;
          return (prev + 1) % images.length;
        });
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => {
          if (prev === null) return 0;
          return (prev - 1 + images.length) % images.length;
        });
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, images.length]);

  const currentIndex = activeIndex ?? 0;
  const currentImage = activeIndex === null ? null : images[currentIndex];

  return (
    <>
      <div className="gallery">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            className="card card-button"
            onClick={() => setActiveIndex(index)}
            aria-label={
              isEn
                ? `Open image ${index + 1} from ${title}`
                : `Abrir imagen ${index + 1} de ${title}`
            }
          >
            <Image
              src={src}
              alt={`${title} ${index + 1}`}
              width={1000}
              height={750}
              sizes="(max-width: 760px) 50vw, (max-width: 1200px) 33vw, 280px"
              quality={68}
            />
          </button>
        ))}
      </div>

      {mounted && currentImage
        ? createPortal(
            <div
              className="lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={isEn ? `${title} enlarged image` : `${title} imagen ampliada`}
              onClick={() => setActiveIndex(null)}
            >
              <button
                type="button"
                className="lightbox-close"
                onClick={() => setActiveIndex(null)}
                aria-label={isEn ? "Close gallery" : "Cerrar galeria"}
              >
                ×
              </button>

              <div className="lightbox-stage" onClick={(event) => event.stopPropagation()}>
                <figure className="lightbox-figure">
                  {images.length > 1 ? (
                    <button
                      type="button"
                      className="lightbox-nav prev"
                      onClick={showPrev}
                      aria-label={isEn ? "Previous image" : "Imagen anterior"}
                    >
                      ‹
                    </button>
                  ) : null}

                  <Image
                    key={currentImage}
                    src={currentImage}
                    alt={`${title} ${currentIndex + 1}`}
                    width={1800}
                    height={1200}
                    sizes="(max-width: 900px) 100vw, 92vw"
                    quality={82}
                    onLoad={() => setLoadingImage(false)}
                    priority
                  />

                  {images.length > 1 ? (
                    <button
                      type="button"
                      className="lightbox-nav next"
                      onClick={showNext}
                      aria-label={isEn ? "Next image" : "Siguiente imagen"}
                    >
                      ›
                    </button>
                  ) : null}

                  <figcaption>
                    {title} · {currentIndex + 1}/{images.length}
                  </figcaption>
                  {loadingImage ? <div className="lightbox-skeleton" /> : null}
                </figure>
                <p className="lightbox-hint">
                  {isEn
                    ? "Esc to close · Arrow keys to navigate"
                    : "Esc para cerrar · Flechas para navegar"}
                </p>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
