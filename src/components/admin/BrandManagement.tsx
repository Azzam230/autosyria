"use client"

import { useEffect, useState, useRef, type FormEvent } from "react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Modal from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react"
import { getImageUrl } from "@/lib/utils"

interface Brand {
  id: string
  name: string
  logo_url: string | null
  created_at: string
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 2 * 1024 * 1024

export default function BrandManagement() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editBrand, setEditBrand] = useState<Brand | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  async function loadBrands() {
    setLoading(true)
    try {
      const res = await fetch("/api/brands")
      if (res.ok) setBrands(await res.json())
    } catch { showToast("فشل تحميل الماركات", "error") }
    setLoading(false)
  }

  useEffect(() => { loadBrands() }, [])

  function openAdd() {
    setEditBrand(null)
    setLogoFile(null)
    setLogoPreview(null)
    setFileError("")
    setModalOpen(true)
  }

  function openEdit(brand: Brand) {
    setEditBrand(brand)
    setLogoFile(null)
    setLogoPreview(brand.logo_url ? getImageUrl(brand.logo_url, "brand-logos") : null)
    setFileError("")
    setModalOpen(true)
  }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError("")
    const file = e.target.files?.[0]
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) { setFileError("يُسمح فقط بصور JPG, PNG, WebP"); return }
    if (file.size > MAX_FILE_SIZE) { setFileError("حجم الصورة يجب ألا يتجاوز 2MB"); return }
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  async function safeJson(res: Response) {
    try { return await res.json() } catch { return { error: "خطأ في الاستجابة" } }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    try {
      const form = new FormData(e.currentTarget)
      const name = (form.get("name") as string).trim()
      if (!name) { showToast("اسم الماركة مطلوب", "error"); setSaving(false); return }

      let logo_url = editBrand?.logo_url || ""

      if (logoFile) {
        const uploadForm = new FormData()
        uploadForm.append("file", logoFile)
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadForm })
        const uploadData = await safeJson(uploadRes)
        if (!uploadRes.ok) { showToast(uploadData.error || "فشل رفع الشعار", "error"); setSaving(false); return }
        if (editBrand?.logo_url) { fetch(`/api/upload?path=${encodeURIComponent(editBrand.logo_url)}`, { method: "DELETE" }).catch(() => {}) }
        logo_url = uploadData.path
      }

      const method = editBrand ? "PUT" : "POST"
      const body = editBrand ? { id: editBrand.id, name, logo_url } : { name, logo_url }
      const res = await fetch("/api/brands", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const data = await safeJson(res)

      setSaving(false)
      if (!res.ok) { showToast(data.error || "حدث خطأ", "error"); return }

      showToast(editBrand ? "تم تحديث الماركة" : "تمت إضافة الماركة", "success")
      setModalOpen(false)
      loadBrands()
    } catch {
      showToast("حدث خطأ غير متوقع", "error")
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/brands?id=${id}`, { method: "DELETE" })
    const data = await safeJson(res)
    if (!res.ok) { showToast(data.error || "فشل الحذف", "error"); return }
    showToast("تم حذف الماركة", "success")
    setDeleteConfirm(null)
    loadBrands()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">الماركات</h2>
        <Button size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          إضافة ماركة
        </Button>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editBrand ? "تعديل ماركة" : "إضافة ماركة جديدة"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" label="اسم الماركة" defaultValue={editBrand?.name} placeholder="مثال: تويوتا" required />
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">الشعار (اختياري)</label>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 w-full p-3 rounded-lg border border-dashed border-border bg-card hover:bg-card-hover transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-muted" />
              <span className="text-sm text-muted">{logoPreview ? "تغيير الشعار" : "اختر صورة الشعار"}</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogo} ref={fileInputRef} className="hidden" />
            </button>
            {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
            {logoPreview && (
              <div className="relative mt-2 inline-block">
                <img src={logoPreview} alt="logo preview" className="h-16 w-16 object-contain rounded-lg border border-border" />
                <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null) }} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" loading={saving} className="flex-1">{editBrand ? "تحديث" : "إضافة"}</Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">إلغاء</Button>
          </div>
        </form>
      </Modal>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-12 text-muted text-sm">لا توجد ماركات مضافة بعد</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {brands.map(brand => (
            <div key={brand.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
              {brand.logo_url ? (
                <img src={getImageUrl(brand.logo_url, "brand-logos")} alt={brand.name} className="w-12 h-12 object-contain rounded-lg" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center text-lg font-bold text-muted">
                  {brand.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{brand.name}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(brand)} className="p-1.5 rounded-lg hover:bg-card-hover text-muted hover:text-foreground transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteConfirm(brand.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="حذف ماركة">
        <p className="text-sm text-muted mb-4">هل أنت متأكد من حذف هذه الماركة؟</p>
        <div className="flex gap-2">
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm!)}>حذف</Button>
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>إلغاء</Button>
        </div>
      </Modal>
    </div>
  )
}
