"use client"

import { useState, useRef, type FormEvent } from "react"
import { createClient } from "@/lib/supabase/client"
import { BRANDS } from "@/lib/constants"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"

interface SellFormProps {
  onSuccess: () => void
}

export default function SellForm({ onSuccess }: SellFormProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const supabaseRef = useRef<any>(null)
  const getSupabase = () => {
    if (!supabaseRef.current) supabaseRef.current = createClient()
    return supabaseRef.current
  }

  const brandOptions = BRANDS.map(b => ({ value: b, label: b }))

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})

    const form = new FormData(e.currentTarget)
    const data = {
      brand: form.get("brand") as string,
      model: form.get("model") as string,
      year: Number(form.get("year")),
      expected_price: Number(form.get("expected_price")),
      phone_number: form.get("phone_number") as string,
    }

    const newErrors: Record<string, string> = {}
    if (!data.brand) newErrors.brand = "يرجى اختيار الماركة"
    if (!data.model) newErrors.model = "يرجى إدخال الموديل"
    if (!data.year || data.year < 1990 || data.year > 2027) newErrors.year = "يرجى إدخال سنة صحيحة"
    if (!data.expected_price || data.expected_price <= 0) newErrors.expected_price = "يرجى إدخال سعر صحيح"
    if (!data.phone_number || data.phone_number.length < 7) newErrors.phone_number = "يرجى إدخال رقم هاتف صحيح"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    const { error } = await getSupabase().from("sell_requests").insert([data])

    setLoading(false)

    if (error) {
      setErrors({ form: "حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً." })
      return
    }

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="p-3 rounded-lg bg-red-900/20 border border-red-800 text-red-400 text-sm">
          {errors.form}
        </div>
      )}

      <Select name="brand" label="الماركة" options={brandOptions} placeholder="اختر الماركة" error={errors.brand} />
      <Input name="model" label="الموديل" placeholder="مثال: أفانتي, سيراتو" error={errors.model} />
      <Input name="year" label="سنة الصنع" type="number" placeholder="مثال: 2020" error={errors.year} />
      <Input name="expected_price" label="السعر المطلوب ($)" type="number" placeholder="مثال: 15000" error={errors.expected_price} />
      <Input name="phone_number" label="رقم التواصل" type="tel" placeholder="مثال: 093XXXXXXX" error={errors.phone_number} />

      <Button type="submit" size="lg" loading={loading} className="w-full">
        إرسال الطلب
      </Button>
    </form>
  )
}
