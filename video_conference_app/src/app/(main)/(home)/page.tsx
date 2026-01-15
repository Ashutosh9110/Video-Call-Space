"use client"  

import { useState } from "react"
import { useMenuState } from "@/app/hooks/useMenuState"
import { startDoorAnimation } from "@/components/landing/startDoorAnimation"

const HomePage = () => {
  const menuOpen = useMenuState()
  const [showAnimation, setShowAnimation] = useState(false)

  const handleOverlayClic = () => {
    if (showAnimation) return
    setShowAnimation(true)
  }

  const handleStartExperience = (e) => {
    e.stopPropagation()
    startDoorAnimation()
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      {menuOpen && (
        <div 
          className="fixed inset-0 z-40 pt-20 cursor-pointer"
          onClick={handleOverlayClic}
        >
          <div className="w-full h-full flex justify-center items-center">
            <div
              className={`transition-all duration-500 ease-out ${
                menuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Click to Begin Experience
                </h2>
                <p className="text-gray-300">
                  Experience the animated hero reveal
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-50 flex-1 w-full flex flex-col justify-center items-center">
        <h1 className="text-6xl font-bold text-white mb-8">Connect Anywhere</h1>
        <p className="text-xl text-gray-300 text-center max-w-2xl">
          Seamless video conferencing for the modern world
        </p>
        <button
          onClick={handleStartExperience}
          className="mt-8 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors"
        >
          Start Experience
        </button>
      </div>

      <div className="fixed inset-0 z-30 pointer-events-none">
      <div className="absolute left-0 top-0 w-1/2 h-full bg-black door-left"></div>
        <div className="absolute right-0 top-0 w-1/2 h-full bg-black door-right"></div>
      </div>

    </div>
    
  )
}

export default HomePage 