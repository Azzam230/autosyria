"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { SITE_NAME } from "@/lib/constants"
import Button from "@/components/ui/Button"

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/sell", label: "بيع سيارتك" },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">AS</span>
          </div>
          <span className="font-bold text-lg text-foreground">{SITE_NAME}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-sm text-muted hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
          <Link href="/admin/dashboard">
            <Button variant="secondary" size="sm">لوحة التحكم</Button>
          </Link>
        </nav>

        <button className="md:hidden p-2 rounded-lg hover:bg-card transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 py-3 flex flex-col gap-2">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-card transition-colors" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/admin/dashboard" onClick={() => setMenuOpen(false)}>
              <Button variant="secondary" size="sm" className="w-full">لوحة التحكم</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
