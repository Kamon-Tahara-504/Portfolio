"use client";

import React, { useMemo, useState, useEffect } from "react";

const INITIAL_PARTICLE_COUNT = 90;
const MAX_PARTICLE_COUNT = 140;
const SPAWN_INTERVAL_MS = 1200;
const SPAWN_BATCH_SIZE = 4;
const RING_RATIO = 0.5;
const MIN_SIZE = 4;
const MAX_SIZE = 12;
const MIN_DURATION = 8;
const MAX_DURATION = 18;
const MIN_DELAY = 0;
const MAX_DELAY = 2;

interface ParticleConfig {
  id: number;
  left: number;
  bottom: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  isRing: boolean;
}

interface BubbleParticlesProps {
  className?: string;
  count?: number;
}

function createParticleConfig(seed: number, index: number): ParticleConfig {
  const x = Math.sin(seed + index * 1.1) * 0.5 + 0.5;
  const y = Math.cos(seed + index * 0.7) * 0.5 + 0.5;
  const z = Math.sin(seed + index * 0.5) * 0.5 + 0.5;
  const isRing = ((seed + index) % 100) / 100 < RING_RATIO;
  return {
    id: index,
    left: x * 100,
    bottom: z * 100,
    size: MIN_SIZE + (y * (MAX_SIZE - MIN_SIZE)),
    duration: Math.round(MIN_DURATION + (x * (MAX_DURATION - MIN_DURATION))),
    delay: Math.round((y * (MAX_DELAY - MIN_DELAY)) + MIN_DELAY),
    driftX: (Math.sin(seed + index * 2) * 12) + 4,
    isRing,
  };
}

export default function BubbleParticles({
  className = "",
  count = INITIAL_PARTICLE_COUNT,
}: BubbleParticlesProps) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<ParticleConfig[]>([]);
  const nextIdRef = React.useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const seed = Math.random() * 1000;
    const initial = Array.from({ length: count }, (_, i) => {
      const config = createParticleConfig(seed, i);
      config.id = nextIdRef.current++;
      return config;
    });
    setParticles(initial);
  }, [mounted, count]);

  useEffect(() => {
    if (!mounted || particles.length >= MAX_PARTICLE_COUNT) return;
    const intervalId = setInterval(() => {
      setParticles((prev) => {
        if (prev.length >= MAX_PARTICLE_COUNT) return prev;
        const seed = Math.random() * 1000 + Date.now();
        const batch = Array.from({ length: SPAWN_BATCH_SIZE }, (_, i) => {
          const config = createParticleConfig(seed, prev.length + i);
          config.id = nextIdRef.current++;
          return config;
        });
        return [...prev, ...batch];
      });
    }, SPAWN_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [mounted, particles.length]);

  return (
    <div
      className={`absolute inset-0 z-0 overflow-visible pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full animate-bubble-float ${
            p.isRing
              ? "border-2 border-black/35 bg-transparent"
              : "bg-black/35"
          }`}
          style={{
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ["--bubble-drift-x" as string]: `${p.driftX}px`,
            ["--bubble-drift-y" as string]: "-180vh",
          }}
        />
      ))}
    </div>
  );
}
