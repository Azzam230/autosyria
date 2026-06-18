import type { Metadata } from "next"
import SellPageClient from "./PageClient"

export const metadata: Metadata = {
  title: "بيع سيارتك الآن",
  description: "بيع سيارتك في السويداء بسهولة عبر SiwdaCars. املأ النموذج وسنقوم بالتواصل معك في أقرب وقت.",
  openGraph: {
    title: "بيع سيارتك الآن | SiwdaCars",
    description: "بيع سيارتك في السويداء بسهولة عبر SiwdaCars. املأ النموذج وسنقوم بالتواصل معك في أقرب وقت.",
  },
}

export default function SellPage() {
  return <SellPageClient />
}
