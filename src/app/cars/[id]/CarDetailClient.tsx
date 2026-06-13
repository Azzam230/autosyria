"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Calendar, Gauge } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { Car } from "@/lib/types"

interface CarDetailClientProps {
  car: Car
  imageUrls: string[]
  whatsappLink: string
}

export default function CarDetailClient({ car: c, imageUrls, whatsappLink }: CarDetailClientProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const specs = [
    { label: "الماركة", value: c.brand },
    { label: "الموديل", value: c.model },
    { label: "سنة الصنع", value: c.year },
    { label: "المدينة", value: c.governorate },
    { label: "السعر", value: formatPrice(c.price) },
    ...(c.mileage ? [{ label: "المسافة المقطوعة", value: `${c.mileage.toLocaleString()} كم` }] : []),
  ]

  return (
    <div className="pb-24 md:pb-12">
      {/* Image Gallery */}
      <div className="relative bg-card">
        <div className="relative aspect-[16/10] md:aspect-[16/7] overflow-hidden">
          {imageUrls.length > 0 ? (
            <Image
              src={imageUrls[activeIndex]}
              alt={`${c.brand} ${c.model} ${c.year}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-card-hover">
              <span className="text-muted/30">لا توجد صورة</span>
            </div>
          )}

          {imageUrls.length > 1 && (
            <>
              <button
                onClick={() => setActiveIndex(i => (i > 0 ? i - 1 : imageUrls.length - 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={() => setActiveIndex(i => (i < imageUrls.length - 1 ? i + 1 : 0))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
            </>
          )}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imageUrls.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === activeIndex ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </div>

        {imageUrls.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto bg-card border-b border-border">
            {imageUrls.map((url, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative w-20 h-14 rounded-md overflow-hidden shrink-0 transition-all ${i === activeIndex ? "ring-2 ring-accent" : "opacity-60 hover:opacity-100"}`}
              >
                <Image src={url} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pt-5 space-y-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors">
          <ArrowRight className="w-4 h-4" />
          العودة للنتائج
        </Link>

        {/* Header Info */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
            {c.brand} {c.model} {c.year}
          </h1>
          <div className="text-2xl md:text-3xl font-bold text-accent mt-2">
            {formatPrice(c.price)}
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {c.governorate}
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(c.created_at).toLocaleDateString("ar-SA")}
            </span>
          </div>
        </div>

        {/* Specs Grid */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">المواصفات الأساسية</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {specs.map((spec, i) => (
              <div key={i} className="rounded-lg bg-card border border-border p-3">
                <p className="text-[11px] text-muted mb-0.5">{spec.label}</p>
                <p className="text-sm font-medium text-foreground">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>

        {c.mileage && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
            <Gauge className="w-5 h-5 text-muted shrink-0" />
            <div>
              <p className="text-xs text-muted">المسافة المقطوعة</p>
              <p className="font-medium text-foreground">{c.mileage.toLocaleString()} كم</p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted leading-relaxed">
          أعلن رقم {c.ref_number} • تاريخ الإعلان: {new Date(c.created_at).toLocaleDateString("ar-SA")}
        </div>
      </div>

      {/* Sticky Bottom Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border p-3 z-40">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          تواصل للشراء عبر الواتساب
        </a>
      </div>

      {/* Desktop WhatsApp Button */}
      <div className="hidden md:block max-w-4xl mx-auto px-4 mt-6">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          تواصل للشراء عبر الواتساب
        </a>
      </div>
    </div>
  )
}
