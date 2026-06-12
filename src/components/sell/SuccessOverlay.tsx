import { CheckCircle } from "lucide-react"

export default function SuccessOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-2xl border border-green-800 bg-background p-8 text-center shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">تم الإرسال بنجاح!</h2>
        <p className="text-muted text-sm">
          شكراً لتواصلك معنا. سنقوم بمراجعة طلبك والتواصل معك قريباً.
        </p>
      </div>
    </div>
  )
}
