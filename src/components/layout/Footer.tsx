import { SITE_NAME } from "@/lib/constants"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs">AS</span>
            </div>
            <span className="font-semibold text-foreground">{SITE_NAME}</span>
          </div>
          <p className="text-sm text-muted text-center">
            جميع الحقوق محفوظة © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  )
}
