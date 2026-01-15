import gsap from "gsap"

export function startDoorAnimation() {
  const layer = document.querySelector(".door-layer")

  layer.classList.remove("hidden")

  const tl = gsap.timeline({
    onComplete() {
      layer.classList.add("hidden")
      gsap.set(".door-left, .door-right", { x: 0 })
    }
  })

  tl.set(".door-left, .door-right", { opacity: 1 })
    .to(".door-left", {
      x: "-100vw",
      duration: 1.2,
      ease: "power4.inOut"
    })
    .to(".door-right", {
      x: "100vw",
      duration: 1.2,
      ease: "power4.inOut"
    }, "<")
}
