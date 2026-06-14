"use client"

import { useState, useRef, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabaseRef = useRef<any>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string

    try {
      const { createClient } = await import("@/lib/supabase/client")
      if (!supabaseRef.current) {
        try {
          supabaseRef.current = createClient()
        } catch {
          setError("Supabase غير مهيأ. تأكد من ضبط .env.local")
          setLoading(false)
          return
        }
      }

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("انتهت مهلة الاتصال")), 15000)
      )

      const authPromise = supabaseRef.current.auth.signInWithPassword({ email, password })
      const result = await Promise.race([authPromise, timeoutPromise]) as any

      if (result.error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
        setLoading(false)
        return
      }

      router.push("/admin/dashboard")
    } catch (err: any) {
      setError(err?.message === "انتهت مهلة الاتصال" ? "انتهت مهلة الاتصال. تحقق من اتصالك بالإنترنت" : "حدث خطأ في الاتصال")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-sm text-muted">تسجيل دخول المشرف</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">{error}</div>
            )}
            <Input name="email" label="البريد الإلكتروني" type="email" placeholder="admin@autosyria.com" dir="ltr" required />
            <Input name="password" label="كلمة المرور" type="password" placeholder="••••••••" dir="ltr" required />
            <Button type="submit" size="lg" loading={loading} className="w-full">دخول</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
