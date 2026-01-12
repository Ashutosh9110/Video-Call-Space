"use client"

import { useEffect, useRef } from "react"
import { initMenuAnimations } from "./animations"

export default function Menu() {
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true

      requestAnimationFrame(() => {
        initMenuAnimations()
      })
    }
  }, [])

  return (
    <div className="menu fixed inset-0 pointer-events-none z-[1]">
      <div className="menu-bg absolute inset-0">
        <div className="menu-bg-left absolute left-0 w-1/2 h-full overflow-hidden">
          <div className="menu-bg-left-inner w-full h-full bg-[#474437] rotate-180 scale-[2] origin-right" />
        </div>

        <div className="menu-bg-right absolute right-0 w-1/2 h-full overflow-hidden">
          <div className="menu-bg-right-inner w-full h-full bg-[#403d31] -rotate-180 scale-[2] origin-left" />
        </div>
      </div>

      <div className="menu-items absolute inset-0 flex">
        <div className="flex-1 flex flex-col justify-center items-center gap-8">
          {["Manifesto","Spatial Journey","Material Archive","Visit Atelier","Rituals"].map(t => (
            <a key={t} className="menu-link text-4xl uppercase">{t}</a>
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center items-center gap-8 font-serif text-3xl">
          {["Tactile Vault","Form Experiments","Carbon Networks","Shadow Library","Collections"].map(t => (
            <a key={t}>{t}</a>
          ))}
        </div>
      </div>
    </div>
  )
}
