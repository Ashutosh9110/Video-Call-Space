import gsap from "gsap"
import CustomEase from "gsap/CustomEase"

gsap.registerPlugin(CustomEase)
CustomEase.create("hop", "0.85, 0, 0.15, 1")

export function initMenuAnimations() {
  const toggle = document.querySelector(".nav-toggle-btn")
  const menu = document.querySelector(".menu")
  if (!toggle || !menu) return

  let open = false

  const tl = gsap.timeline({
    paused: true,
    onComplete() {
      window.dispatchEvent(new CustomEvent("menu:open"))
    },
    onReverseComplete() {
      window.dispatchEvent(new CustomEvent("menu:close"))
    }
  })

  tl.to(".bar-1", { y: 4, rotate: 45, duration: 1, ease: "hop" }, 0)
    .to(".bar-2", { y: -4, rotate: -45, duration: 1, ease: "hop" }, 0)
    .to(".menu-bg-left-inner", { rotate: 0, duration: 1, ease: "hop" }, 0)
    .to(".menu-bg-right-inner", { rotate: 0, duration: 1, ease: "hop" }, 0)
    .to(".menu-items", {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
      pointerEvents: "auto"
    }, "-=0.3")
    .from(".menu-items a", {
      y: 30,
      opacity: 0,
      stagger: 0.06,
      duration: 0.5,
      ease: "power3.out"
    }, "-=0.3")

  toggle.addEventListener("click", () => {
    if (!open) tl.play()
    else tl.reverse()
    open = !open
  })
}

