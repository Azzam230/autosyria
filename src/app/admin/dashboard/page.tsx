"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ToastProvider } from "@/components/ui/Toast"
import CarManagement from "@/components/admin/CarManagement"
import SellRequestsTable from "@/components/admin/SellRequestsTable"
import BrandManagement from "@/components/admin/BrandManagement"
import AdManagement from "@/components/admin/AdManagement"
import Button from "@/components/ui/Button"
import { LogOut, Car, ClipboardList, Tag, BarChart3, DollarSign, Mail, Megaphone } from "lucide-react"

interface Stats {
  availableCars: number
  soldCars: number
  pendingRequests: number
  totalBrands: number
}

type Tab = "cars" | "requests" | "brands" | "ads"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("cars")
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const router = useRouter()
  const supabaseRef = useRef<any>(null)

  useEffect(() => {
    async function init() {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        supabaseRef.current = createClient()
        const { data: { user } } = await supabaseRef.current.auth.getUser()
        if (!user) {
          router.push("/admin/login")
          return
        }
        setAuthorized(true)

        const [carsRes, soldRes, reqRes, brandsRes] = await Promise.all([
          supabaseRef.current.from("cars").select("*", { count: "exact", head: true }).eq("status", "available"),
          supabaseRef.current.from("cars").select("*", { count: "exact", head: true }).eq("status", "sold"),
          supabaseRef.current.from("sell_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabaseRef.current.from("brands").select("*", { count: "exact", head: true }),
        ])
        setStats({
          availableCars: carsRes.count ?? 0,
          soldCars: soldRes.count ?? 0,
          pendingRequests: reqRes.count ?? 0,
          totalBrands: brandsRes.count ?? 0,
        })
      } catch {
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router])

  async function handleLogout() {
    await supabaseRef.current?.auth.signOut()
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!authorized) return null

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "cars", label: "إدارة الإعلانات", icon: <Car className="w-4 h-4" /> },
    { key: "brands", label: "الماركات", icon: <Tag className="w-4 h-4" /> },
    { key: "requests", label: "طلبات البيع", icon: <ClipboardList className="w-4 h-4" /> },
    { key: "ads", label: "الإعلانات المدفوعة", icon: <Megaphone className="w-4 h-4" /> },
  ]

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              تسجيل خروج
            </Button>
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="rounded-xl bg-card border border-border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Car className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted">متوفرة</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.availableCars}</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs text-muted">مباعة</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.soldCars}</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-muted">طلبات معلقة</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.pendingRequests}</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-muted">ماركات</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.totalBrands}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mb-6 p-1 rounded-xl bg-card border border-border">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-muted hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "cars" && <CarManagement />}
          {activeTab === "brands" && <BrandManagement />}
          {activeTab === "requests" && <SellRequestsTable />}
          {activeTab === "ads" && <AdManagement />}
        </div>
      </div>
    </ToastProvider>
  )
}
