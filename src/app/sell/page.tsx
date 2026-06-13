"use client"

import { useState } from "react"
import SellForm from "@/components/sell/SellForm"
import SuccessOverlay from "@/components/sell/SuccessOverlay"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) return <SuccessOverlay />

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6">
        <ArrowRight className="w-4 h-4" />
        العودة للرئيسية
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">بيع سيارتك الآن</h1>
        <p className="text-sm text-muted mt-1">املأ النموذج وسنقوم بالتواصل معك في أقرب وقت</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 md:p-6">
        <SellForm onSuccess={() => setSubmitted(true)} />
      </div>
    </div>
  )
}
