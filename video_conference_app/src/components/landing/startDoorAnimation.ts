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

  tl.fromTo(".door-left", {
    xPercent: -100,
  }, {
    xPercent: 0,
    duration: 1,
    ease: "power4.inOut",
  }, 0.3).fromTo(".door-right", {
    xPercent: 100,
  }, {
    xPercent: 0,
    duration: 1,
    ease: "power4.inOut",
  },
    0.3
  )
}