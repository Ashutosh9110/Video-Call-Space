"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
  className?: string
}

export function ScrollReveal({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 1,
  className = "" 
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    if (!ref.current || !inView) return

    const ctx = gsap.context(() => {
      const animations = {
        up: { y: 100, opacity: 0 },
        down: { y: -100, opacity: 0 },
        left: { x: 100, opacity: 0 },
        right: { x: -100, opacity: 0 },
      }

      gsap.from(ref.current, {
        ...animations[direction],
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [inView, direction, delay, duration])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

interface StaggerRevealProps {
  children: React.ReactNode[]
  stagger?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
}

export function StaggerReveal({ 
  children, 
  stagger = 0.1, 
  direction = "up",
  className = "" 
}: StaggerRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const animations = {
        up: { y: 100, opacity: 0 },
        down: { y: -100, opacity: 0 },
        left: { x: 100, opacity: 0 },
        right: { x: -100, opacity: 0 },
      }

      gsap.from(containerRef.current.children, {
        ...animations[direction],
        duration: 0.8,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [stagger, direction])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function Parallax({ children, speed = 0.5, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: -50 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [speed])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

interface TextRevealProps {
  text: string
  className?: string
}

export function TextReveal({ text, className = "" }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      // Split text into words
      const words = text.split(" ")
      
      // Create spans for each word
      ref.current.innerHTML = words
        .map(word => `<span class="inline-block">${word}</span>`)
        .join(" ")

      // Animate each word
      gsap.from(ref.current.children, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [text])

  return (
    <div ref={ref} className={className}>
      {text}
    </div>
  )
}

interface ScaleRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function ScaleReveal({ children, delay = 0, className = "" }: ScaleRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}