"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import type { Ad } from "@/lib/types"

interface AdDisplayProps {
  ad: Ad
  className?: string
}

export default function AdDisplay({ ad, className = "" }: AdDisplayProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [viewed, setViewed] = useState(false)

  useEffect(() => {
    if (viewed || !ref.current) return
    const el = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setViewed(true)
          fetch("/api/ads", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: ad.id, action: "view" }),
          }).catch(() => {})
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ad.id, viewed])

  async function handleClick() {
    await fetch("/api/ads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ad.id, action: "click" }),
    }).catch(() => {})
  }

  const wrapperClass = `relative overflow-hidden rounded-lg bg-card border border-border ${className}`
  const content = (
    <div className="relative w-full h-full">
      <Image
        src={ad.image_url}
        alt={ad.alt_text || "إعلان"}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  )

  if (ad.link_url) {
    return (
      <div ref={ref} className={wrapperClass}>
        <a
          href={ad.link_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block w-full h-full"
        >
          {content}
        </a>
      </div>
    )
  }

  return (
    <div ref={ref} className={wrapperClass}>
      {content}
    </div>
  )
}
