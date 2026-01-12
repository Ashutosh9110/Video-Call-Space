import gsap from "gsap"
import CustomEase from "gsap/CustomEase"

gsap.registerPlugin(CustomEase)
CustomEase.create("hop", "0.85, 0, 0.15, 1")

export function initMenuAnimations() {
  const toggle = document.querySelector(".nav-toggle-btn")
  const menu = document.querySelector(".menu")

  if (!toggle || !menu) return

  let open = false

  const tl = gsap.timeline({ paused: true })

  tl.to(".bar-1", { y: 4, rotate: 45, duration: 1, ease: "hop" }, 0)
    .to(".bar-2", { y: -4, rotate: -45, duration: 1, ease: "hop" }, 0)
    .to(".menu-bg-left-inner", { rotate: 0, duration: 1, ease: "hop" }, 0)
    .to(".menu-bg-right-inner", { rotate: 0, duration: 1, ease: "hop" }, 0)

  toggle.addEventListener("click", () => {
    open ? tl.reverse() : tl.play()
    menu.classList.toggle("active")
    open = !open
  })
}
