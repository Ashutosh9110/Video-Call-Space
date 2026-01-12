"use client"

import Menu from "./Menu"

export default function Nav() {
  return (
    <>
      <nav className="fixed w-full p-8 flex items-center z-20">
        <div className="flex-1">
          <div className="nav-toggle-btn cursor-pointer w-[60px] h-[60px] p-5 flex flex-col gap-[5px] border border-white/20 rounded-full">
            <span className="bar-1 h-[1.5px] w-full bg-white" />
            <span className="bar-2 h-[1.5px] w-full bg-white" />
          </div>
        </div>

        <div className="flex-1 text-center uppercase text-sm tracking-wide">
          Carbon Structure
        </div>

        <div className="flex-1 text-right">
          <a className="border border-white/20 px-5 py-2 rounded-full text-sm">
            Start Journey
          </a>
        </div>
      </nav>

      <Menu />
    </>
  )
}
