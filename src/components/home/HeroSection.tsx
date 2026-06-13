"use client"

import Link from "next/link"
import Button from "@/components/ui/Button"
import { Car, ArrowLeft, MapPin, MessageCircle } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
            <Car className="w-4 h-4" />
            <span>سوق السيارات الأول في سوريا</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            ابحث عن سيارتك القادمة
          </h1>
          <p className="text-muted text-lg max-w-lg leading-relaxed">
            تصفح أحدث إعلانات السيارات في جميع المحافظات السورية. تواصل مباشرة مع البائع عبر واتساب.
          </p>
          <div className="flex gap-3 mt-2">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5 text-accent" />
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground text-sm">تشكيلة واسعة</p>
              <p className="text-xs text-muted">جميع الماركات والموديلات</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground text-sm">كل سوريا</p>
              <p className="text-xs text-muted">إعلانات من جميع المحافظات</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border sm:col-span-1">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-accent" />
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground text-sm">تواصل فوري</p>
              <p className="text-xs text-muted">راسل البائع عبر واتساب</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
