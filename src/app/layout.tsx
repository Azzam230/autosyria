import type { Metadata } from "next"
import { Alexandria } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

const alexandria = Alexandria({
  subsets: ["arabic"],
  variable: "--font-alexandria",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Auto Syria | سوق السيارات في سوريا",
  description: "سوق السيارات الأول في سوريا - بيع وشراء السيارات",
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
