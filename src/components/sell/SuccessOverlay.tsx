import { CheckCircle } from "lucide-react"

export default function SuccessOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-accent" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">تم الإرسال بنجاح!</h2>
        <p className="text-muted text-sm leading-relaxed">
          شكراً لتواصلك معنا. سنقوم بمراجعة طلبك والتواصل معك قريباً.
        </p>
      </div>
    </div>
  )
}
