import type { Metadata } from "next"
import SellPageClient from "./PageClient"

export const metadata: Metadata = {
  title: "بيع سيارتك الآن",
  description: "بيع سيارتك في سوريا بسهولة عبر Auto Syria. املأ النموذج وسنقوم بالتواصل معك في أقرب وقت.",
  openGraph: {
    title: "بيع سيارتك الآن | Auto Syria",
    description: "بيع سيارتك في سوريا بسهولة عبر Auto Syria. املأ النموذج وسنقوم بالتواصل معك في أقرب وقت.",
  },
}

export default function SellPage() {
  return <SellPageClient />
}
