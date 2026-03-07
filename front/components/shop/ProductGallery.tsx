'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  productName: string;
  images: string[];
}

export function ProductGallery({ productName, images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400">
        No Image
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <Image
          src={getImageUrl(selectedImage)}
          alt={productName}
          fill
          className="object-cover transition-opacity duration-300"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img: string, idx: number) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={cn(
                "relative aspect-square bg-gray-100 rounded-lg overflow-hidden border transition-all cursor-pointer",
                selectedImage === img 
                  ? "border-primary-500 ring-2 ring-primary-500/20" 
                  : "border-gray-200 hover:border-primary-300"
              )}
            >
              <Image
                src={getImageUrl(img)}
                alt={`${productName} ${idx + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
