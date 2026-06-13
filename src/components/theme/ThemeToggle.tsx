"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    if (stored === "light") {
      document.documentElement.classList.add("light")
      setIsLight(true)
    }
  }, [])

  function toggle() {
    const next = !isLight
    if (next) {
      document.documentElement.classList.add("light")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.remove("light")
      localStorage.setItem("theme", "dark")
    }
    setIsLight(next)
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-card transition-colors"
      title={isLight ? "الوضع الليلي" : "الوضع النهاري"}
    >
      {isLight ? <Moon className="w-5 h-5 text-muted" /> : <Sun className="w-5 h-5 text-muted" />}
    </button>
  )
}
