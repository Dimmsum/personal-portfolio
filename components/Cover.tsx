"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, type ReactNode } from "react";

/* Shows the image if there is one, otherwise (or if it fails to load) the fallback. */
export function Cover({ src, alt, fallback }: { src?: string; alt: string; fallback: ReactNode }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <>{fallback}</>;
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
