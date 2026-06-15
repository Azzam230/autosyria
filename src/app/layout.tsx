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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://autosyria.com"

export const viewport: Viewport = {
  themeColor: "#D61A22",
}

export const metadata: Metadata = {
  title: {
    default: "Auto Syria | سوق السيارات في سوريا",
    template: "%s | Auto Syria",
  },
  description: "سوق السيارات الأول في سوريا - بيع وشراء السيارات المستعملة والجديدة في جميع المحافظات السورية",
  keywords: ["سيارات", "سوق السيارات", "سوريا", "بيع سيارات", "شراء سيارات", "auto Syria", "car market Syria"],
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "ar_SY",
    siteName: "Auto Syria",
    title: "Auto Syria | سوق السيارات في سوريا",
    description: "سوق السيارات الأول في سوريا - بيع وشراء السيارات المستعملة والجديدة",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auto Syria | سوق السيارات في سوريا",
    description: "سوق السيارات الأول في سوريا - بيع وشراء السيارات المستعملة والجديدة",
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
