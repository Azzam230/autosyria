import type { Metadata, Viewport } from "next"
import { Alexandria } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

const alexandria = Alexandria({
  subsets: ["arabic"],
  variable: "--font-alexandria",
  display: "swap",
})

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://siwdacars.com"

export const viewport: Viewport = {
  themeColor: "#D61A22",
}

export const metadata: Metadata = {
  title: {
    default: "SiwdaCars | أول منصة سيارات في السويداء",
    template: "%s | SiwdaCars",
  },
  description: "أول منصة متخصصة في بيع وشراء السيارات في السويداء - تصفح أحدث إعلانات السيارات المتوفرة للبيع في محافظة السويداء",
  keywords: ["سيارات", "سوق السيارات", "السويداء", "بيع سيارات", "شراء سيارات", "SiwdaCars", "سيارات السويداء"],
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "ar_SY",
    siteName: "SiwdaCars",
    title: "SiwdaCars | أول منصة سيارات في السويداء",
    description: "أول منصة متخصصة في بيع وشراء السيارات في السويداء - تصفح أحدث الإعلانات",
  },
  twitter: {
    card: "summary_large_image",
    title: "SiwdaCars | أول منصة سيارات في السويداء",
    description: "أول منصة متخصصة في بيع وشراء السيارات في السويداء",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${alexandria.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.toggle('dark',localStorage.getItem('theme')==='dark')` }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
