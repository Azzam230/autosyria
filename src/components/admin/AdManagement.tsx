"use client"

import { useEffect, useState, useRef, type FormEvent } from "react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Modal from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { Plus, Pencil, Trash2, Upload, X, Eye, MousePointerClick } from "lucide-react"
import type { Ad, AdPosition } from "@/lib/types"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 2 * 1024 * 1024

const POSITIONS: { value: AdPosition; label: string }[] = [
  { value: "home_between_cards", label: "بين بطاقات الصفحة الرئيسية" },
  { value: "search_sidebar", label: "الشريط الجانبي للبحث" },
  { value: "car_detail_sidebar", label: "الشريط الجانبي لتفاصيل السيارة" },
]

export default function AdManagement() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editAd, setEditAd] = useState<Ad | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  async function loadAds() {
    setLoading(true)
    try {
      const res = await fetch("/api/ads")
      if (res.ok) setAds(await res.json())
    } catch { showToast("فشل تحميل الإعلانات", "error") }
    setLoading(false)
  }

  useEffect(() => { loadAds() }, [])

  function openAdd() {
    setEditAd(null)
    setImageFile(null)
    setImagePreview(null)
    setFileError("")
    setModalOpen(true)
  }

  function openEdit(ad: Ad) {
    setEditAd(ad)
    setImageFile(null)
    setImagePreview(ad.image_url)
    setFileError("")
    setModalOpen(true)
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError("")
    const file = e.target.files?.[0]
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) { setFileError("يُسمح فقط بصور JPG, PNG, WebP"); return }
    if (file.size > MAX_FILE_SIZE) { setFileError("حجم الصورة يجب ألا يتجاوز 2MB"); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function safeJson(res: Response) {
    try { return await res.json() } catch { return { error: "خطأ في الاستجابة" } }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    try {
      const form = new FormData(e.currentTarget)
      const position = form.get("position") as string
      const link_url = (form.get("link_url") as string).trim()
      const alt_text = (form.get("alt_text") as string).trim()
      const sort_order = Number(form.get("sort_order")) || 0

      if (!position) { showToast("الموقع مطلوب", "error"); setSaving(false); return }

      let image_url = editAd?.image_url || ""

      if (imageFile) {
        const uploadForm = new FormData()
        uploadForm.append("file", imageFile)
        uploadForm.append("bucket", "ad-images")
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadForm })
        const uploadData = await safeJson(uploadRes)
        if (uploadData.error) { showToast(uploadData.error, "error"); setSaving(false); return }
        image_url = uploadData.path
      } else if (!editAd) {
        showToast("الصورة مطلوبة", "error"); setSaving(false); return
      }

      if (editAd) {
        const res = await fetch("/api/ads", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editAd.id, image_url, link_url, position, alt_text, sort_order }),
        })
        const data = await safeJson(res)
        if (data.error) { showToast(data.error, "error"); setSaving(false); return }
        showToast("تم تعديل الإعلان", "success")
      } else {
        const res = await fetch("/api/ads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_url, link_url, position, alt_text, sort_order }),
        })
        const data = await safeJson(res)
        if (data.error) { showToast(data.error, "error"); setSaving(false); return }
        showToast("تمت إضافة الإعلان", "success")
      }

      setModalOpen(false)
      loadAds()
    } catch {
      showToast("حدث خطأ", "error")
    }
    setSaving(false)
  }

  async function confirmDelete() {
    if (!deleteConfirm) return
    try {
      const res = await fetch(`/api/ads?id=${deleteConfirm}`, { method: "DELETE" })
      const data = await safeJson(res)
      if (data.error) { showToast(data.error, "error"); return }
      showToast("تم حذف الإعلان", "success")
      setDeleteConfirm(null)
      loadAds()
    } catch { showToast("حدث خطأ", "error") }
  }

  async function toggleActive(ad: Ad) {
    try {
      const res = await fetch("/api/ads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ad.id, is_active: !ad.is_active }),
      })
      const data = await safeJson(res)
      if (data.error) { showToast(data.error, "error"); return }
      showToast(ad.is_active ? "تم تعطيل الإعلان" : "تم تفعيل الإعلان", "success")
      loadAds()
    } catch { showToast("حدث خطأ", "error") }
  }

  if (loading) return <div className="text-center text-muted py-8">جاري التحميل...</div>

  function getPositionLabel(pos: string) {
    return POSITIONS.find(p => p.value === pos)?.label || pos
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">إدارة الإعلانات ({ads.length})</h2>
        <Button size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          إضافة إعلان
        </Button>
      </div>

      <div className="grid gap-3">
        {ads.map(ad => (
          <div key={ad.id} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <div className="w-20 h-16 rounded-lg bg-card-hover overflow-hidden shrink-0">
                <img src={ad.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{getPositionLabel(ad.position)}</p>
                <p className="text-sm text-muted">
                  {ad.link_url ? "رابط موجود" : "بدون رابط"} • الترتيب {ad.sort_order}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {ad.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <MousePointerClick className="w-3 h-3" />
                    {ad.clicks}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ad.is_active}
                    onChange={() => toggleActive(ad)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted/30 rounded-full peer peer-checked:bg-green-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                </label>
                <button
                  onClick={() => openEdit(ad)}
                  className="p-2 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-accent"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(ad.id)}
                  className="p-2 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {ads.length === 0 && (
          <p className="text-center text-muted py-8">لا توجد إعلانات. أضف إعلاناً جديداً.</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editAd ? "تعديل إعلان" : "إضافة إعلان جديد"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">الموقع</label>
            <select
              name="position"
              defaultValue={editAd?.position || ""}
              required
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">اختر الموقع</option>
              {POSITIONS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">صورة الإعلان</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-border hover:border-accent transition-colors text-muted hover:text-accent"
            >
              <Upload className="w-5 h-5" />
              {imagePreview ? "تغيير الصورة" : "اختيار صورة"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImage}
              className="hidden"
            />
            {fileError && <p className="text-sm text-red-500 mt-1">{fileError}</p>}
            {imagePreview && (
              <div className="relative w-full h-32 mt-2 rounded-lg overflow-hidden bg-card-hover">
                <img src={imagePreview} alt="" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null) }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            )}
          </div>

          <Input name="link_url" label="رابط الإعلان (اختياري)" type="url" placeholder="https://..." defaultValue={editAd?.link_url || ""} />

          <Input name="alt_text" label="نص بديل (اختياري)" placeholder="وصف قصير للصورة" defaultValue={editAd?.alt_text || ""} />

          <Input name="sort_order" label="الأولوية (رقم أقل = ظهور أكثر)" type="number" defaultValue={editAd?.sort_order?.toString() || "0"} />

          <Button type="submit" className="w-full" loading={saving}>
            {editAd ? "حفظ التعديلات" : "إضافة الإعلان"}
          </Button>
        </form>
      </Modal>

      <Modal open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="حذف الإعلان">
        <p className="text-muted mb-4">هل أنت متأكد من حذف هذا الإعلان؟</p>
        <div className="flex gap-2">
          <Button variant="danger" className="flex-1" onClick={confirmDelete}>حذف</Button>
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteConfirm(null)}>إلغاء</Button>
        </div>
      </Modal>
    </div>
  )
}
