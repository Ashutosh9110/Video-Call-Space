"use client"

import { useEffect, useRef } from "react"
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
    <main className="relative w-full min-h-screen overflow-hidden bg-[#1a1a1a]">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/images/hero.jpg)" }}
      />

      <div className="fixed inset-0 bg-black/30 -z-10" />


      <section className="relative z-10 min-h-screen pt-16">
        {children}
      </section>
    </main>
  )
}

export default HomeLayout
