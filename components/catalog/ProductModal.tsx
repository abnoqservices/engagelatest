// components/catalog/ProductModal.tsx
'use client';

import { useState } from 'react';
import { X, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductModalProps {
  product: any;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product || !product.images?.length) {
    return (
      <div className="p-12 text-center text-slate-600">
        No images available for this product
      </div>
    );
  }

  const currentImage = product.images[currentImageIndex];
  const hasMultipleImages = product.images.length > 1;

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-20 rounded-full bg-white/90 p-3 shadow-lg hover:bg-slate-100 transition-colors"
      >
        <X className="h-6 w-6 text-slate-700" />
      </button>

      <div className="grid md:grid-cols-2 gap-0">
        {/* Left: Image Gallery Section */}
        <div className="flex flex-col h-full">
          {/* Main Image */}
          <div className="relative h-[380px] sm:h-[450px] md:h-[580px] bg-slate-50 overflow-hidden group">
            <img
              src={currentImage}
              alt={`${product.name} - view ${currentImageIndex + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
            />

            {/* Navigation arrows - only show when multiple images */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/70 p-3 shadow-md hover:bg-white transition-all opacity-70 hover:opacity-100"
                >
                  <ChevronLeft className="h-6 w-6 text-slate-800" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/70 p-3 shadow-md hover:bg-white transition-all opacity-70 hover:opacity-100"
                >
                  <ChevronRight className="h-6 w-6 text-slate-800" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/65 text-white text-sm px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              </>
            )}

            {/* Category badge */}
            {product.category && (
              <Badge className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm px-3 py-1">
                {product.category}
              </Badge>
            )}
          </div>

          {/* Thumbnails - only show when multiple images */}
          {hasMultipleImages && (
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-slate-100">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`
                      flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden 
                      border-2 transition-all duration-200 snap-start
                      ${idx === currentImageIndex 
                        ? 'border-amber-600 scale-105 shadow-md ring-1 ring-amber-400' 
                        : 'border-transparent opacity-75 hover:opacity-100 hover:border-amber-300 hover:scale-105'}
                    `}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto max-h-[85vh] md:max-h-none">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                {product.name}
              </h2>

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-4xl font-bold text-amber-700">
                  {product.price}
                </span>
                {product.inStock ? (
                  <Badge className="bg-green-100 text-green-800 border border-green-200 px-3 py-1">
                    In Stock
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 border border-red-200 px-3 py-1">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Description</h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {product.description || "No detailed description available."}
              </p>
            </div>

            {/* Features */}
            {product.features?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">Key Features</h3>
                <ul className="space-y-2 text-slate-700">
                  {product.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-amber-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm border-t border-slate-100 pt-6">
              {product.dimensions && (
                <div>
                  <p className="text-slate-600 font-medium">Dimensions</p>
                  <p className="font-semibold">{product.dimensions}</p>
                </div>
              )}
              {product.weight && (
                <div>
                  <p className="text-slate-600 font-medium">Weight</p>
                  <p className="font-semibold">{product.weight}</p>
                </div>
              )}
              {product.material && (
                <div>
                  <p className="text-slate-600 font-medium">Material</p>
                  <p className="font-semibold">{product.material}</p>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="pt-8">
              <Button
                className="w-full py-6 text-base shadow-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 transition-all"
                disabled={!product.inStock}
                onClick={() => alert(`Added ${product.name} to cart!`)}
              >
                <ShoppingCart className="mr-3 h-5 w-5" />
                {product.inStock ? product.cta || 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}