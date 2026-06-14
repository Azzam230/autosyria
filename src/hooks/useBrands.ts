"use client"

import { useState, useEffect } from "react"

interface Brand {
  id: string
  name: string
  logo_url: string | null
}

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    fetch("/api/brands")
      .then(r => r.ok ? r.json() : [])
      .then(setBrands)
      .catch(() => {})
  }, [])

  return brands
}

export function useBrandNames() {
  const brands = useBrands()
  return brands.map(b => b.name)
}
