import React from 'react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  isAvailable: boolean;
  selectedImage: number;
  onImageSelect: (index: number) => void;
}

/**
 * ProductImageGallery Component
 *
 * Main product image with thumbnail gallery
 * Handles image selection and error states
 */
export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
  isAvailable,
  selectedImage,
  onImageSelect,
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2Y5ZmJmZiIvPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMwMCwzMDApIj4KICAgIDxzdmcgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYTNhM2EzIiBzdHJva2Utd2lkdGg9IjEiPgogICAgICA8cGF0aCBkPSJNMTIgNC41YzEuNSAwIDMuNS43IDQuNSAyLjUgMCAwLS41IDEuNS0yIDJsLS41LS41Yy0uNS0uNS0xLS41LTEuNSAwLS41LjUtLjUgMS0uNSAxLjVsMi41IDJzMS41IDAgMS41LTJjMC0yLjUtMi0yLjUtMy01LS41LTEuNS0yLTItMy0yLTIgMC00IDItNCA0IDAgMiAyIDQgNCA0czQtMiA0LTQtMi00LTQtNC0xIDAtMSAxIDEgMSAxIDFoMnptLTIgOC41Yy0uNSAwLTEtLjUtMS0xczEtMSAxLTFoNWMuNSAwIDEgLjUgMSAxcy0uNSAxLTEgMXptLTIgMmMtLjUgMC0xLS41LTEtMXMuNS0xIDEtMWgzYy41IDAgMSAuNSAxIDFzLS41IDEtMSAxeiIvPgogICAgPC9zdmc+CiAgPC9nPgo8L3N2Zz4=';
  };

  return (
    <div className="lg:col-span-2">
      {/* Main Image */}
      <div className="mb-4 rounded-xl overflow-hidden bg-gray-100 aspect-[4/3] max-w-md mx-auto lg:max-w-none relative">
        {images && images.length > 0 ? (
          <img
            src={images[selectedImage]}
            alt={productName}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-32 h-32 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Not Available Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">Not Available</span>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? 'border-cyan-500 ring-2 ring-cyan-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
