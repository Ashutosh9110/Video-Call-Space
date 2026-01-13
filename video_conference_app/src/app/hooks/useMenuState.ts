"use client"

import { useEffect, useState } from "react"

export function useMenuState() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const openHandler = () => setOpen(true)
    const closeHandler = () => setOpen(false)

    window.addEventListener("menu:open", openHandler)
    window.addEventListener("menu:close", closeHandler)

    return () => {
      window.removeEventListener("menu:open", openHandler)
      window.removeEventListener("menu:close", closeHandler)
    }
  }, [])

  return open
}
