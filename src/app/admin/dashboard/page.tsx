"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ToastProvider } from "@/components/ui/Toast"
import CarManagement from "@/components/admin/CarManagement"
import SellRequestsTable from "@/components/admin/SellRequestsTable"
import Button from "@/components/ui/Button"
import { LogOut, Car, ClipboardList } from "lucide-react"

type Tab = "cars" | "requests"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("cars")
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabaseRef = useRef<any>(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        supabaseRef.current = createClient()
        const { data: { user } } = await supabaseRef.current.auth.getUser()
        if (!user) {
          router.push("/admin/login")
        } else {
          setAuthorized(true)
        }
      } catch {
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
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

          <div className="flex items-center gap-2 mb-6 p-1 rounded-xl bg-card border border-border">
            <button
              onClick={() => setActiveTab("cars")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "cars" ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-muted hover:text-foreground"
              }`}
            >
              <Car className="w-4 h-4" />
              إدارة الإعلانات
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "requests" ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-muted hover:text-foreground"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              طلبات البيع
            </button>
          </div>

          {activeTab === "cars" && <CarManagement />}
          {activeTab === "requests" && <SellRequestsTable />}
        </div>
      </div>
    </ToastProvider>
  )
}
