import Image from "next/image";

interface HeroSectionProps {
  image: string;
  title: string;
  subtitle?: string;
}

export default function HeroSection({
  image,
  title,
  subtitle,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src={image}
          alt="Hero"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 text-center text-white">
        <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl lg:text-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
}

