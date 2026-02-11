import ProtectedImage from "@/components/ProtectedImage";

// basePathの定義（開発環境では空、本番環境では'/Portfolio'）
const basePath = process.env.NODE_ENV === 'production' ? '/Portfolio' : '';

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
          <ProtectedImage
            wrapperClassName="absolute inset-0"
            src={image.startsWith('/') ? `${basePath}${image}` : image}
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

