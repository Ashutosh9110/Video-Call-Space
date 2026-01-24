"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DoorTransitionProps {
  isTransitioning: boolean;
  onComplete?: () => void;
}

const DoorTransition = ({ isTransitioning, onComplete }: DoorTransitionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTransitioning || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Create a timeline for the closing animation
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      // Ensure the container is visible
      gsap.set(containerRef.current, { display: "flex", autoAlpha: 1 });

      // Animate the doors closing
      // Left door slides in from left (-100% to 0%)
      // Right door slides in from right (100% to 0%)
      tl.to(".door-left", {
        xPercent: 0,
        duration: 1,
        ease: "power4.inOut",
      })
      .to(".door-right", {
        xPercent: 0,
        duration: 1,
        ease: "power4.inOut",
      }, "<"); // Run at the same time

    }, containerRef);

    return () => ctx.revert();
  }, [isTransitioning, onComplete]);

  // If not transitioning, we don't render anything to avoid black screen issues
  if (!isTransitioning) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[100] pointer-events-none flex"
      style={{ display: "none" }} // GSAP will handle showing it
    >
      <div 
        className="relative w-1/2 h-full bg-black door-left" 
        style={{ transform: "translate(-100%, 0)" }} // Start off-screen
      />
      <div 
        className="relative w-1/2 h-full bg-black door-right" 
        style={{ transform: "translate(100%, 0)" }} // Start off-screen
      />
    </div>
  );
};

export default DoorTransition;
