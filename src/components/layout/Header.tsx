"use client"

import Link from "next/link"
import { Car, PlusCircle } from "lucide-react"
import { SITE_NAME } from "@/lib/constants"
import ThemeToggle from "@/components/theme/ThemeToggle"
import MobileSearchBar from "./MobileSearchBar"

const navLinks = [
  { href: "/", label: "الرئيسية", icon: Car },
  { href: "/sell", label: "بيع سيارتك", icon: PlusCircle },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md">
      {/* Top Row: Logo + Sell Link */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/sell" className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-semibold">
            <PlusCircle className="w-3.5 h-3.5" />
            بيع سيارتك
          </Link>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Car className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm text-foreground tracking-tight">{SITE_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <div className="flex items-center gap-1 bg-muted/20 rounded-xl p-1">
              {navLinks.map(link => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card"
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center gap-1 mr-2 pr-2 border-r border-border">
              <Link
                href="/admin/dashboard"
                className="px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card-hover"
              >
                لوحة التحكم
              </Link>
              <div className="mr-1">
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      </div>

      <MobileSearchBar />
    </header>
  )
}
