"use client"

import { useState } from "react"
import SellForm from "@/components/sell/SellForm"
import SuccessOverlay from "@/components/sell/SuccessOverlay"
import { Car, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) return <SuccessOverlay />

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-8">
        <ArrowRight className="w-4 h-4" />
        العودة للرئيسية
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Car className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">بيع سيارتك الآن</h1>
          <p className="text-sm text-muted">املأ النموذج وسنقوم بالتواصل معك</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <SellForm onSuccess={() => setSubmitted(true)} />
      </div>
    </div>
  )
}
