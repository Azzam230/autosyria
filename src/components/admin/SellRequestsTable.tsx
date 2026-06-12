"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import Badge from "@/components/ui/Badge"
import Card from "@/components/ui/Card"
import { useToast } from "@/components/ui/Toast"
import { Phone, Check, Eye } from "lucide-react"
import type { SellRequest } from "@/lib/types"

const statusLabels: Record<string, { label: string; variant: "warning" | "success" | "default" }> = {
  pending: { label: "قيد الانتظار", variant: "warning" },
  reviewed: { label: "تمت المراجعة", variant: "default" },
  approved: { label: "تمت الموافقة", variant: "success" },
}

export default function SellRequestsTable() {
  const [requests, setRequests] = useState<SellRequest[]>([])
  const [loading, setLoading] = useState(true)
  const supabaseRef = useRef<any>(null)
  const getSupabase = () => {
    if (!supabaseRef.current) supabaseRef.current = createClient()
    return supabaseRef.current
  }
  const { showToast } = useToast()

  const fetchRequests = useCallback(async () => {
    const { data } = await getSupabase().from("sell_requests").select("*").order("created_at", { ascending: false })
    if (data) setRequests(data as SellRequest[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchRequests() }, [fetchRequests])

  async function updateStatus(id: string, status: string) {
    const { error } = await getSupabase().from("sell_requests").update({ status }).eq("id", id)
    if (!error) {
      fetchRequests()
      showToast("تم تحديث حالة الطلب", "success")
    }
  }

  if (loading) return <div className="text-center text-muted py-8">جاري التحميل...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">طلبات البيع الواردة ({requests.length})</h2>

      <div className="grid gap-3">
        {requests.map(req => (
          <Card key={req.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="font-medium text-foreground">{req.brand} {req.model} {req.year}</p>
                <p className="text-sm text-muted">السعر المطلوب: {Number(req.expected_price).toLocaleString()} $</p>
                <p className="text-xs text-muted">{new Date(req.created_at).toLocaleDateString("ar-SA")}</p>
              </div>
              <div className="flex items-center gap-2">
                <a href={`tel:${req.phone_number}`} className="p-2 rounded-lg bg-green-900/20 text-green-400 hover:bg-green-900/40 transition-colors">
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${req.phone_number.replace(/^0/, "963")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-green-900/20 text-green-400 hover:bg-green-900/40 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <Badge variant={statusLabels[req.status]?.variant as "warning" | "success" | "default"}>
                {statusLabels[req.status]?.label}
              </Badge>
              <div className="flex gap-1">
                {req.status === "pending" && (
                  <button
                    onClick={() => updateStatus(req.id, "reviewed")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-card hover:bg-card-hover border border-border transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    تمت المراجعة
                  </button>
                )}
                {req.status === "reviewed" && (
                  <button
                    onClick={() => updateStatus(req.id, "approved")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-900/20 text-green-400 hover:bg-green-900/40 border border-green-800 transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    موافقة
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {requests.length === 0 && (
          <p className="text-center text-muted py-8">لا توجد طلبات حتى الآن</p>
        )}
      </div>
    </div>
  )
}
