"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  alt: string
  getImageUrl: (path: string) => string
}

export default function ImageGallery({ images, alt, getImageUrl }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="relative cursor-pointer" onClick={() => setLightboxIndex(0)}>
          <img
            src={getImageUrl(images[0])}
            alt={alt}
            className="w-full aspect-[4/3] object-cover hover:opacity-90 transition-opacity"
          />
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
              +{images.length - 1}
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-1.5 p-2 overflow-x-auto">
            {images.slice(1, 5).map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i + 1)}
                className="w-16 h-12 rounded-lg overflow-hidden shrink-0 hover:ring-2 ring-accent transition-all"
              >
                <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
          <button className="absolute top-4 left-4 text-white/80 hover:text-white p-2" onClick={() => setLightboxIndex(null)}>
            <X className="w-6 h-6" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
            onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i! > 0 ? i! - 1 : images.length - 1)) }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
            onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i! < images.length - 1 ? i! + 1 : 0)) }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <img
            src={getImageUrl(images[lightboxIndex])}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={e => e.stopPropagation()}
          />
          <div className="absolute bottom-4 text-white/60 text-sm">{lightboxIndex + 1} / {images.length}</div>
        </div>
      )}
    </>
  )
}
