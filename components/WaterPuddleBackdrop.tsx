"use client";

import { useId, useMemo, useRef, useState, useEffect } from "react";
import ProtectedImage from "@/components/ProtectedImage";
import type { WaterPuddle, WaterPuddleClipVariant } from "@/types/waterPuddles";
import puddlesData from "@/data/water-puddles.json";

const basePath = process.env.NODE_ENV === "production" ? "/Portfolio" : "";

/** clipPathUnits="objectBoundingBox" 用の有機形パス */
const BLOB_PATHS: Record<WaterPuddleClipVariant, string> = {
  "1": "M0.5,0.12 C0.78,0.08 0.95,0.38 0.88,0.58 C0.82,0.88 0.52,0.96 0.28,0.88 C0.05,0.78 0.08,0.42 0.22,0.22 C0.35,0.06 0.42,0.1 0.5,0.12 Z",
  "2": "M0.2,0.5 C0.15,0.25 0.45,0.05 0.65,0.15 C0.92,0.28 0.95,0.55 0.82,0.75 C0.68,0.95 0.4,0.92 0.22,0.78 C0.08,0.65 0.12,0.55 0.2,0.5 Z",
  "3": "M0.48,0.05 C0.68,0.1 0.88,0.35 0.85,0.55 C0.82,0.82 0.55,0.94 0.35,0.88 C0.12,0.82 0.05,0.55 0.12,0.35 C0.18,0.15 0.35,0.02 0.48,0.05 Z",
  "4": "M0.5,0.08 C0.75,0.05 0.92,0.3 0.9,0.5 C0.88,0.75 0.65,0.92 0.42,0.9 C0.18,0.88 0.08,0.62 0.1,0.4 C0.12,0.18 0.32,0.05 0.5,0.08 Z",
  "5": "M0.35,0.2 C0.55,0.08 0.82,0.22 0.88,0.45 C0.94,0.68 0.78,0.88 0.52,0.92 C0.28,0.95 0.08,0.78 0.08,0.52 C0.08,0.32 0.2,0.22 0.35,0.2 Z",
};

function resolveSrc(path: string): string {
  return path.startsWith("/") ? `${basePath}${path}` : path;
}

interface PuddleItemProps {
  p: WaterPuddle;
  clipUrl: string;
}

function PuddleItem({ p, clipUrl }: PuddleItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const rotate = p.rotate ?? 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05, rootMargin: "120px 0px 120px 0px" }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute"
      style={{
        top: p.top,
        left: p.left,
        width: p.width,
        height: p.height,
        transform: `rotate(${rotate}deg) scale(${visible ? 1 : 0.88})`,
        transformOrigin: "center center",
        clipPath: clipUrl,
        WebkitClipPath: clipUrl,
        opacity: visible ? 1 : 0,
        transition: "opacity 1.2s ease-out, transform 1.4s ease-out",
        willChange: "opacity, transform",
      }}
    >
      <div className="relative h-full w-full">
        <ProtectedImage
          src={resolveSrc(p.image)}
          alt={p.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 32vw"
          wrapperClassName="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}

export default function WaterPuddleBackdrop() {
  const reactId = useId();
  const clipIdPrefix = useMemo(
    () => `wp-clip-${reactId.replace(/:/g, "")}`,
    [reactId]
  );

  const puddles = puddlesData as WaterPuddle[];
  const variants: WaterPuddleClipVariant[] = ["1", "2", "3", "4", "5"];

  return (
    <div
      className="water-puddle-backdrop pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.5] motion-reduce:opacity-[0.14]"
      aria-hidden="true"
    >
      <svg
        className="absolute h-0 w-0 overflow-hidden"
        aria-hidden
        focusable="false"
      >
        <defs>
          {variants.map((v) => (
            <clipPath
              key={v}
              id={`${clipIdPrefix}-${v}`}
              clipPathUnits="objectBoundingBox"
            >
              <path d={BLOB_PATHS[v]} />
            </clipPath>
          ))}
        </defs>
      </svg>

      {puddles.map((p) => {
        const variant = p.clipVariant in BLOB_PATHS ? p.clipVariant : "1";
        const clipUrl = `url(#${clipIdPrefix}-${variant})`;
        return <PuddleItem key={p.id} p={p} clipUrl={clipUrl} />;
      })}
    </div>
  );
}
