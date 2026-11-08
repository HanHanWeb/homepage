"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "@/components/animated-icons";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

type MarqueeImage = { src: string; alt: string; category: string; cropTop?: boolean };

/** A continuous three-column gallery with one lightbox item per original image. */
export function ThreeDMarquee({ images, label, pauseLabel, playLabel }: {
  images: readonly MarqueeImage[];
  label: string;
  pauseLabel: string;
  playLabel: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const columns = Array.from({ length: 3 }, (_, column) =>
    images.filter((_, index) => index % 3 === column)
  );

  return (
    <div ref={root} className="marquee-gallery relative mt-5" data-paused={paused || !visible || galleryOpen}>
      <div className="marquee-viewport rounded-xl border bg-muted/40" role="region" aria-label={label}>
        <div className="marquee-plane">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="marquee-column">
              <div className="marquee-track" style={{ "--marquee-duration": `${46 + columnIndex * 7}s` } as CSSProperties}>
                {/* Three copies keep the steep perspective filled throughout each loop. */}
                {[0, 1, 2].map((copy) => (
                  <div key={copy} className="marquee-copy" aria-hidden={copy > 0 ? true : undefined}>
                    {column.map((image) => (
                      <button
                        type="button"
                        key={image.src}
                        aria-label={`${image.category} · ${image.alt}`}
                        aria-haspopup="dialog"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setGalleryOpen(true);
                          Fancybox.show(images.map((entry) => ({
                            src: entry.src,
                            type: "image",
                            caption: `${entry.category} · ${entry.alt}`,
                          })), {
                            startIndex: images.indexOf(image),
                            triggerEl: event.currentTarget,
                            on: { destroy: () => setGalleryOpen(false) },
                          });
                        }}
                        tabIndex={copy > 0 ? -1 : undefined}
                        className="marquee-image group relative block w-full overflow-hidden rounded-lg border bg-card text-left shadow-lg outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        {/* Source images have mixed dimensions; the fixed aspect reserves layout space. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.src}
                          alt={copy > 0 ? "" : image.alt}
                          loading="lazy"
                          draggable={false}
                          className="size-full object-cover"
                          style={{ objectPosition: image.cropTop ? "top" : "center" }}
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 to-transparent px-3 pt-8 pb-2 text-xs text-white">
                          {image.category}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? playLabel : pauseLabel}
        aria-pressed={paused}
        className="marquee-control absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full border bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
      </button>
    </div>
  );
}
