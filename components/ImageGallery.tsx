import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-video w-full overflow-hidden border border-black bg-black/5"
        >
          <Image
            src={image}
            alt={`${alt} - Image ${index + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}

