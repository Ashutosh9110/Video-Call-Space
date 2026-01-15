"use client"

import { useState } from "react"
import { useMenuState } from "@/app/hooks/useMenuState"
import { startDoorAnimation } from "@/components/landing/startDoorAnimation"

const HomePage = () => {
  const menuOpen = useMenuState()

  const handleOverlayClick = () => {
    // your existing overlay animation logic
  }

  const handleStartExperience = (e) => {
    e.stopPropagation()
    startDoorAnimation()
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ===== Door Animation Layer ===== */}
      <div className="fixed inset-0 z-[60] pointer-events-none hidden door-layer">
        <div className="absolute left-0 top-0 w-1/2 h-full bg-black door-left" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-black door-right" />
      </div>

      {/* ===== Menu Overlay ===== */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[40] pt-20 cursor-pointer"
          onClick={handleOverlayClick}
        >
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Click to Begin Experience
              </h2>
              <p className="text-gray-300">
                Experience the animated hero reveal
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== Main Content ===== */}
      <div className="relative z-[50] flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-white mb-8">Connect Anywhere</h1>
        <p className="text-xl text-gray-300 text-center max-w-2xl">
          Seamless video conferencing for the modern world
        </p>
        <button
          onClick={handleStartExperience}
          className="mt-8 px-6 py-3 bg-white text-black rounded-full font-semibold"
        >
          Start Experience
        </button>
      </div>
    </div>
  )
}

export default HomePage
