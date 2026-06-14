"use client"

import { useState, useRef, type FormEvent, type ChangeEvent } from "react"
import { createClient } from "@/lib/supabase/client"
import { useBrandNames } from "@/hooks/useBrands"
import { GOVERNORATES } from "@/lib/constants"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Modal from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { Upload, X } from "lucide-react"
import type { Car } from "@/lib/types"

interface EditCarFormProps {
  car: Car
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EditCarForm({ car, open, onClose, onSuccess }: EditCarFormProps) {
  const [loading, setLoading] = useState(false)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(car.images || [])
  const brands = useBrandNames()
  const supabaseRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const getSupabase = () => {
    if (!supabaseRef.current) supabaseRef.current = createClient()
    return supabaseRef.current
  }
  const { showToast } = useToast()

  function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setNewFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  function removeNewFile(index: number) {
    setNewFiles(prev => prev.filter((_, i) => i !== index))
  }

  function removeExisting(index: number) {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const data = {
      brand: form.get("brand") as string,
      model: form.get("model") as string,
      year: Number(form.get("year")),
      price: Number(form.get("price")),
      mileage: form.get("mileage") ? Number(form.get("mileage")) : null,
      governorate: form.get("governorate") as string,
    }

    const supabase = getSupabase()
    const newPaths: string[] = []

    if (newFiles.length > 0) {
      for (const file of newFiles) {
        const ext = file.name.split(".").pop()
        const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(filePath, file, { contentType: file.type })

        if (uploadError) {
          showToast("فشل رفع الصورة: " + uploadError.message, "error")
          setLoading(false)
          return
        }
        newPaths.push(filePath)
      }
    }

    const images = [...existingImages, ...newPaths]

    const { error } = await supabase.from("cars").update({ ...data, images }).eq("id", car.id)
    setLoading(false)

    if (error) {
      showToast("حدث خطأ أثناء تعديل السيارة", "error")
      return
    }

    showToast("تم تعديل السيارة بنجاح", "success")
    onSuccess()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="تعديل السيارة">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <select name="brand" defaultValue={car.brand} required className="rounded-lg border border-border bg-card px-3 py-2.5 text-foreground text-sm">
            <option value="">الماركة</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <Input name="model" defaultValue={car.model} placeholder="الموديل" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input name="year" type="number" defaultValue={car.year} placeholder="سنة الصنع" required />
          <Input name="price" type="number" defaultValue={car.price} placeholder="السعر ($)" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input name="mileage" type="number" defaultValue={car.mileage ?? ""} placeholder="عدد الكيلومترات (اختياري)" />
          <select name="governorate" defaultValue={car.governorate} required className="rounded-lg border border-border bg-card px-3 py-2.5 text-foreground text-sm">
            <option value="">المحافظة</option>
            {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">صور السيارة</label>

          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {existingImages.map((img, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs text-muted">
                  <span className="truncate max-w-20">صورة {i + 1}</span>
                  <button type="button" onClick={() => removeExisting(i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 w-full p-3 rounded-lg border border-dashed border-border bg-card hover:bg-card-hover transition-colors cursor-pointer">
            <Upload className="w-5 h-5 text-muted" />
            <span className="text-sm text-muted">إضافة صور جديدة</span>
            <input type="file" multiple accept="image/*" onChange={handleFiles} ref={fileInputRef} className="hidden" />
          </button>

          {newFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {newFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs text-muted">
                  <span className="truncate max-w-20">{file.name}</span>
                  <button type="button" onClick={() => removeNewFile(i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" loading={loading} className="flex-1">حفظ التعديلات</Button>
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">إلغاء</Button>
        </div>
      </form>
    </Modal>
  )
}
