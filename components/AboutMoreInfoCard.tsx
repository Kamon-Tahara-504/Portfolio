"use client";

import { MoreInfo } from "@/types/profile";

interface AboutMoreInfoCardProps {
  moreInfo: MoreInfo;
  isVisible: boolean;
}

export default function AboutMoreInfoCard({
  moreInfo,
  isVisible,
}: AboutMoreInfoCardProps) {
  return (
    <div
      className={`absolute inset-0 z-10 bg-white border border-black/10 shadow-lg px-4 py-2 md:px-6 md:py-3 overflow-hidden transition-all duration-300 ease-in-out flex flex-col ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-full pointer-events-none"
      }`}
    >
      {moreInfo.title && (
        <h4 className="mb-2 text-lg font-bold tracking-tight md:text-2xl">
          {moreInfo.title}
        </h4>
      )}
      {moreInfo.description && (
        <div className="space-y-3 text-sm leading-relaxed text-black/80 md:text-lg">
          {moreInfo.description.split("\n").map((line, index) => (
            <p
              key={index}
              className={`break-keep break-words ${line.endsWith(":") ? "font-bold text-black/90" : ""}`}
            >
              {line}
            </p>
          ))}
        </div>
      )}
      {moreInfo.items && moreInfo.items.length > 0 && (
        <div className="space-y-4 pt-1">
          {moreInfo.items.map((item, index) => (
            <div key={index} className="space-y-1">
              <span className="text-xs font-bold text-black/70 md:text-base">
                {item.label}:
              </span>
              <p className="text-xs text-black/80 md:text-base">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

