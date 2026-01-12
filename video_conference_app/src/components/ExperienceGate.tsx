"use client"

import { useEffect, useState } from "react"

export default function ExperienceGate({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(true)
    window.addEventListener("experience:open", handler)
    return () => window.removeEventListener("experience:open", handler)
  }, [])

  if (!visible) return null

  return <>{children}</>
}
