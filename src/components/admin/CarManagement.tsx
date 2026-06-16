"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatPrice, getImageUrl } from "@/lib/utils"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import Card from "@/components/ui/Card"
import Modal from "@/components/ui/Modal"
import AddCarForm from "./AddCarForm"
import { useToast } from "@/components/ui/Toast"
import { Plus, Trash2, Check, Pencil, AlertTriangle } from "lucide-react"
import type { Car } from "@/lib/types"
import EditCarForm from "./EditCarForm"

export default function CarManagement() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Car | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabaseRef = useRef<any>(null)
  const getSupabase = () => {
    if (!supabaseRef.current) supabaseRef.current = createClient()
    return supabaseRef.current
  }
  const { showToast } = useToast()

  const fetchCars = useCallback(async () => {
    const { data } = await getSupabase().from("cars").select("*").order("created_at", { ascending: false })
    if (data) setCars(data as Car[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchCars() }, [fetchCars])

  async function toggleStatus(car: Car) {
    const newStatus = car.status === "available" ? "sold" : "available"
    const { error } = await getSupabase().from("cars").update({ status: newStatus }).eq("id", car.id)
    if (!error) {
      fetchCars()
      showToast(`تم تغيير حالة السيارة إلى ${newStatus === "available" ? "متوفرة" : "مباعة"}`, "success")
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await getSupabase().from("cars").delete().eq("id", deleteTarget.id)
    setDeleting(false)
    if (!error) {
      fetchCars()
      showToast("تم حذف الإعلان", "success")
    }
    setDeleteTarget(null)
  }

  if (loading) return <div className="text-center text-muted py-8">جاري التحميل...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">إدارة الإعلانات ({cars.length})</h2>
        <Button size="sm" onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4" />
          إضافة سيارة
        </Button>
      </div>

      <div className="grid gap-3">
        {cars.map(car => (
          <Card key={car.id} className="flex items-center gap-4 p-4">
            <div className="w-20 h-16 rounded-lg bg-card-hover overflow-hidden shrink-0">
              {car.images?.[0] ? (
                <img src={getImageUrl(car.images[0])} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted/30 text-xs">لا توجد</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{car.brand} {car.model} {car.year}</p>
              <p className="text-sm text-muted">{formatPrice(car.price)} • {car.governorate}</p>
            </div>
            <Badge variant={car.status === "available" ? "success" : "danger"}>
              {car.status === "available" ? "متوفرة" : "مباعة"}
            </Badge>
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleStatus(car)}
                className="p-2 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-foreground"
                title="تغيير الحالة"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditingCar(car)}
                className="p-2 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-accent"
                title="تعديل"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteTarget(car)}
                className="p-2 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-red-400"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
        {cars.length === 0 && (
          <p className="text-center text-muted py-8">لا توجد إعلانات بعد</p>
        )}
      </div>

      <AddCarForm open={showAddForm} onClose={() => setShowAddForm(false)} onSuccess={fetchCars} />
      {editingCar && (
        <EditCarForm
          car={editingCar}
          open={!!editingCar}
          onClose={() => setEditingCar(null)}
          onSuccess={fetchCars}
        />
      )}

      <Modal open={!!deleteTarget} onClose={() => !deleting && setDeleteTarget(null)} title="حذف الإعلان">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400">
              هل أنت متأكد من حذف هذا الإعلان؟ هذا الإجراء لا يمكن التراجع عنه.
            </p>
          </div>
          {deleteTarget && (
            <p className="text-sm text-foreground">
              {deleteTarget.brand} {deleteTarget.model} {deleteTarget.year} - {deleteTarget.governorate}
            </p>
          )}
          <div className="flex gap-2 pt-2">
            <Button onClick={confirmDelete} loading={deleting} className="flex-1 bg-red-600 hover:bg-red-700">
              تأكيد الحذف
            </Button>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={deleting} className="flex-1">
              إلغاء
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
