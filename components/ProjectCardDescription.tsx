"use client";

interface ProjectCardDescriptionProps {
  text: string;
  isComingSoon: boolean;
}

export default function ProjectCardDescription({
  text,
  isComingSoon,
}: ProjectCardDescriptionProps) {
  if (isComingSoon) {
    return (
      <p className="text-[10px] font-normal text-white/80 line-clamp-2 whitespace-pre-line md:text-sm">
        {text}
      </p>
    );
  }

  return (
    <div className="h-0 overflow-hidden opacity-0 transition-[height,opacity] duration-300 group-hover:h-4 group-hover:opacity-100 md:group-hover:h-5 group-focus-visible:h-4 group-focus-visible:opacity-100 md:group-focus-visible:h-5">
      <div className="project-desc-marquee-track flex min-w-max items-center gap-8 text-[10px] font-normal text-white/80 md:text-sm">
        <span className="whitespace-nowrap">{text}</span>
        <span className="whitespace-nowrap">{text}</span>
      </div>
    </div>
  );
}
