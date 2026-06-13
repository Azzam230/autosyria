"use client"

import { useState, useRef, type FormEvent, type ChangeEvent } from "react"
import { createClient } from "@/lib/supabase/client"
import { BRANDS, GOVERNORATES } from "@/lib/constants"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Modal from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { Upload, X } from "lucide-react"

interface AddCarFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddCarForm({ open, onClose, onSuccess }: AddCarFormProps) {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const supabaseRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const getSupabase = () => {
    if (!supabaseRef.current) supabaseRef.current = createClient()
    return supabaseRef.current
  }
  const { showToast } = useToast()

  function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index))
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

    let imagePaths: string[] = []

    if (files.length > 0) {
      for (const file of files) {
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

        imagePaths.push(filePath)
      }
    }

    const { error } = await supabase.from("cars").insert([{ ...data, images: imagePaths }] as any)
    setLoading(false)

    if (error) {
      showToast("حدث خطأ أثناء إضافة السيارة", "error")
      return
    }

    showToast("تمت إضافة السيارة بنجاح", "success")
    setFiles([])
    onSuccess()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="إضافة سيارة جديدة">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <select name="brand" required className="rounded-lg border border-border bg-card px-3 py-2.5 text-foreground text-sm">
            <option value="">الماركة</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <Input name="model" placeholder="الموديل" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input name="year" type="number" placeholder="سنة الصنع" required />
          <Input name="price" type="number" placeholder="السعر ($)" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input name="mileage" type="number" placeholder="عدد الكيلومترات (اختياري)" />
          <select name="governorate" required className="rounded-lg border border-border bg-card px-3 py-2.5 text-foreground text-sm">
            <option value="">المحافظة</option>
            {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">صور السيارة</label>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 w-full p-3 rounded-lg border border-dashed border-border bg-card hover:bg-card-hover transition-colors cursor-pointer">
            <Upload className="w-5 h-5 text-muted" />
            <span className="text-sm text-muted">اختر صوراً للسيارة (يمكنك اختيار عدة)</span>
            <input type="file" multiple accept="image/*" onChange={handleFiles} ref={fileInputRef} className="hidden" />
          </button>
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-md bg-card border border-border text-xs text-muted">
                  <span className="truncate max-w-24">{file.name}</span>
                  <button type="button" onClick={() => removeFile(i)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" loading={loading} className="flex-1">إضافة</Button>
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">إلغاء</Button>
        </div>
      </form>
    </Modal>
  )
}
