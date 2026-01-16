// components/landing/startDoorAnimation.ts
import gsap from "gsap"

export const startDoorAnimation = (onComplete: () => void) => {
  const tl = gsap.timeline({
    onComplete, 
  })

  tl.set(".door-layer", { display: "flex" })

  tl.to(".hero-content", {
    opacity: 0,
    scale: 0.95,
    duration: 0.6,
    ease: "power2.out",
  })

  tl.to(".door-left", {
    xPercent: -100,
    duration: 1,
    ease: "power4.inOut",
  }, 0.3).to(
      ".door-right",
  {
    xPercent: 100,
    duration: 1,
    ease: "power4.inOut",
  },
  0.3 
  )
  tl.set(".door-layer", { display: "none" });
}