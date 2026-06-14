"use client"

import Link from "next/link"
import { Menu, X, Car, PlusCircle } from "lucide-react"
import { useState } from "react"
import { SITE_NAME } from "@/lib/constants"
import ThemeToggle from "@/components/theme/ThemeToggle"

const navLinks = [
  { href: "/", label: "الرئيسية", icon: Car },
  { href: "/sell", label: "بيع سيارتك", icon: PlusCircle },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Car className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base text-foreground tracking-tight">{SITE_NAME}</span>
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
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card"
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
              className="px-3 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card-hover"
            >
              لوحة التحكم
            </Link>
            <div className="mr-1">
              <ThemeToggle />
            </div>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-card-hover transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map(link => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-card-hover transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="w-4 h-4 text-muted" />
                  {link.label}
                </Link>
              )
            })}
            <div className="flex items-center justify-between px-3 py-2 mt-1 border-t border-border pt-3">
              <span className="text-sm text-muted">المظهر</span>
              <ThemeToggle />
            </div>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-card-hover transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              لوحة التحكم
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
