import Link from "next/link"
import { SITE_NAME } from "@/lib/constants"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-xs">AS</span>
              </div>
              <span className="font-bold text-foreground">{SITE_NAME}</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              أول منصة عربية متخصصة في بيع وشراء السيارات في سوريا. نقدم لك أفضل العروض من جميع المحافظات.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted hover:text-accent transition-colors">الرئيسية</Link></li>
              <li><Link href="/search" className="text-sm text-muted hover:text-accent transition-colors">بحث متقدم</Link></li>
              <li><Link href="/sell" className="text-sm text-muted hover:text-accent transition-colors">بيع سيارتك</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">تواصل معنا</h3>
            <ul className="space-y-2">
              <li><a href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-accent transition-colors">واتساب</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted">
            جميع الحقوق محفوظة © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  )
}
