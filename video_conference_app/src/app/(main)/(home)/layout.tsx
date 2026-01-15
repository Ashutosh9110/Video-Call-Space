"use client"

import { useEffect, useRef } from "react"
import Nav from "@/components/landing/Nav"
import { initMenuAnimations } from "@/components/landing/animations"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true

      requestAnimationFrame(() => {
        const cleanup = initMenuAnimations()
        return () => cleanup && cleanup()
      })
    }
  }, [])

  return (
    <main className="relative w-full overflow-x-hidden bg-[#1a1a1a]">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/images/hero.jpg)" }}
      />

      <div className="fixed inset-0 bg-black/30 -z-10" />

      <Nav />

      <section className="relative z-10">
        {children}
      </section>
    </main>
  )
}

export default HomeLayout