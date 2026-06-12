"use client"

import Link from "next/link"
import Button from "@/components/ui/Button"
import { Car, ArrowLeft } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm">
            <Car className="w-4 h-4" />
            <span>سوق السيارات الأول في سوريا</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            ابحث عن سيارتك القادمة
          </h1>
          <p className="text-muted text-lg max-w-lg">
            تصفح أحدث إعلانات السيارات في جميع المحافظات السورية. تواصل مباشرة مع البائع عبر واتساب.
          </p>
          <div className="flex gap-3">
            <Link href="#cars">
              <Button size="lg">
                تصفح السيارات
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/sell">
              <Button variant="secondary" size="lg">
                بيع سيارتك
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
