"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { SITE_NAME } from "@/lib/constants"
import ThemeToggle from "@/components/theme/ThemeToggle"

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/sell", label: "بيع سيارتك" },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-xs">AS</span>
          </div>
          <span className="font-bold text-base text-foreground tracking-tight">{SITE_NAME}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="px-3 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card-hover">
              {link.label}
            </Link>
          ))}
          <div className="mr-2 flex items-center gap-1">
            <ThemeToggle />
            <Link
              href="/admin/dashboard"
              className="px-3 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card-hover"
            >
              لوحة التحكم
            </Link>
          </div>
        </nav>

        <button className="md:hidden p-2 rounded-lg hover:bg-card-hover transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-card-hover transition-colors" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-muted">المظهر</span>
              <ThemeToggle />
            </div>
            <Link href="/admin/dashboard" className="px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-card-hover transition-colors" onClick={() => setMenuOpen(false)}>
              لوحة التحكم
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
