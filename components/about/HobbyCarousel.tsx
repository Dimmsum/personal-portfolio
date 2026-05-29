"use client";

import Image from "next/image";
import { useState } from "react";

type Slide = {
  src: string;
  caption: string;
};

const slides: Slide[] = [
  { src: "/picture-1.png", caption: "Placeholder caption — replace with your photo" },
  { src: "/picture-1.png", caption: "Placeholder caption — replace with your photo" },
  { src: "/picture-1.png", caption: "Placeholder caption — replace with your photo" },
];

export function HobbyCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setCurrent((i) => (i + 1) % slides.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Image frame */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-[var(--bg-highlight)]" style={{ aspectRatio: "16/9" }}>
        <Image
          key={current}
          src={slides[current].src}
          alt={slides[current].caption}
          fill
          className="object-cover object-top transition-opacity duration-300"
          unoptimized
        />

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
        >
          <ChevronLeftIcon />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Caption */}
      <p className="text-center text-sm text-[var(--text-muted)] leading-6 px-4">
        {slides[current].caption}
      </p>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-200 ${
              i === current
                ? "w-5 bg-[var(--accent)]"
                : "w-2 bg-[var(--border-subtle)] hover:bg-[var(--text-dim)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
