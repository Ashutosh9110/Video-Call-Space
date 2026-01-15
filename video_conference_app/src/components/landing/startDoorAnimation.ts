import gsap from "gsap"

export function startDoorAnimation() {
  const tl = gsap.timeline()

  tl.set(".door-left, .door-right", { opacity: 1 })
    .to(".door-left", {
      x: "-100%",
      duration: 1.2,
      ease: "power4.inOut"
    })
    .to(".door-right", {
      x: "100%",
      duration: 1.2,
      ease: "power4.inOut"
    }, "<")
}
