"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import DoorTransition from "@/components/landing/DoorTransition";
import { useRouter } from "next/navigation";
import "./home.css";

const HomePage = () => {
  const router = useRouter();
  const animationRef = useRef<number | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartExperience = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTransitioning(true);
  };

  useEffect(() => {
    let ctx: gsap.Context;
    
    ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      
      tl.fromTo(".text-item", 
        { 
          opacity: 0, 
          y: 20, 
          filter: "blur(10px)" 
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          stagger: {
            amount: 3,
            from: "start",
          },
        }
      )
      .fromTo(
        ".rotated-item",
        {
          opacity: 0,
          filter: "blur(10px)"
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.2,
        },
        "-=2"
      );
    }, containerRef);

    const addTimeout = (timeout: NodeJS.Timeout) => {
      timeoutsRef.current.push(timeout);
    };

    const container = document.querySelector(".hero-section") as HTMLElement;
    const speedIndicator = document.querySelector(
      ".speed-indicator"
    ) as HTMLElement;
    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.innerWidth <= 768;

    const config = {
      imageCount: 14,
      imageLifespan: 600,
      removalDelay: 16,
      mouseThreshold: isMobile ? 20 : 40,
      scrollThreshold: 50,
      inDuration: 600,
      outDuration: 800,
      inEasing: "cubic-bezier(.07,.5,.5,1)",
      outEasing: "cubic-bezier(.87, 0, .13, 1)",
      touchImageInterval: 40,
      minMovementForImage: isMobile ? 3 : 5,
      baseImageSize: isMobile ? 180 : 240,
      minImageSize: isMobile ? 120 : 160,
      maxImageSize: isMobile ? 260 : 340,
      baseRotation: 30,
      maxRotationFactor: 3,
      speedSmoothingFactor: 0.25,
      showSpeedIndicator: true,
      staggerRange: 50,
      easing: {
        scale: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        reveal: "cubic-bezier(0.87, 0, 0.13, 1)",
      },
    };

    const images = [
      "https://assets.codepen.io/7558/cr-blurry-orange-small-001.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-002.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-003.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-004.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-005.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-006.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-007.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-008.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-009.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-010.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-011.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-012.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-013.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-014.jpg",
    ];

    type PatternEffect = {
      name: string;
      create: (
        container: HTMLElement,
        imageSrc: string,
        size: number
      ) => Fragment[];
      revealTiming: (i: number, total: number, fragment?: any) => number;
      collapseTiming: (i: number, total: number, fragment?: any) => number;
    };

    type Fragment = {
      element: HTMLElement;
      index: number;
      reveal: () => void;
      collapse: () => void;
    };

    const PATTERNS: Record<string, PatternEffect> = {
      flame: {
        name: "Flame Trail",
        create: (container, imageSrc, size) => {
          const img = document.createElement("img");
          img.className = "trail-img";
          img.src = imageSrc;
          img.width = size;
          img.height = size;
          return [
            {
              element: img,
              index: 0,
              reveal: () => {},
              collapse: () => {},
            },
          ];
        },
        revealTiming: () => 0,
        collapseTiming: () => 0,
      },
      venetian: {
        name: "Venetian Blinds",
        create: (container, imageSrc, size) => {
          const fragments: Fragment[] = [];
          const stripCount = 12;
          const stripHeight = 100 / stripCount;
          for (let i = 0; i < stripCount; i++) {
            const fragment = document.createElement("div");
            fragment.className = "image-fragment";
            const bg = document.createElement("div");
            bg.className = "fragment-bg";
            bg.style.backgroundImage = `url(${imageSrc})`;
            const y = i * stripHeight;
            fragment.style.cssText = `
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  transform: translate3d(0, 0, 0) rotateX(90deg);
                  transform-origin: 50% ${y + stripHeight / 2}%;
                  clip-path: polygon(0% ${y}%, 100% ${y}%, 100% ${
              y + stripHeight
            }%, 0% ${y + stripHeight}%);
                  transition: transform ${config.inDuration}ms ${
              config.easing.reveal
            };
                `;
            fragment.appendChild(bg);
            fragments.push({
              element: fragment,
              index: i,
              reveal: () => {
                fragment.style.transform = `translate3d(0, 0, 0) rotateX(0deg)`;
              },
              collapse: () => {
                fragment.style.transform = `translate3d(0, 0, 0) rotateX(-90deg)`;
              },
            });
          }
          return fragments;
        },
        revealTiming: (i, total) => Math.abs(i - total / 2) * 0.08,
        collapseTiming: (i, total) => i * 0.04,
      },
      liquid: {
        name: "Liquid Drops",
        create: (container, imageSrc, size) => {
          const fragments: Fragment[] = [];
          const positions = [
            { x: 25, y: 20, r: 16 },
            { x: 70, y: 15, r: 12 },
            { x: 45, y: 35, r: 18 },
            { x: 15, y: 55, r: 14 },
            { x: 80, y: 45, r: 15 },
            { x: 55, y: 70, r: 20 },
            { x: 30, y: 80, r: 13 },
            { x: 75, y: 75, r: 17 },
          ];
          positions.forEach((pos, i) => {
            const fragment = document.createElement("div");
            fragment.className = "image-fragment";
            const bg = document.createElement("div");
            bg.className = "fragment-bg";
            bg.style.backgroundImage = `url(${imageSrc})`;
            fragment.style.cssText = `
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  clip-path: circle(0% at ${pos.x}% ${pos.y}%);
                  transition: clip-path ${config.inDuration}ms ${config.easing.reveal};
                `;
            fragment.appendChild(bg);
            fragments.push({
              element: fragment,
              index: i,
              reveal: () => {
                fragment.style.clipPath = `circle(${pos.r}% at ${pos.x}% ${pos.y}%)`;
              },
              collapse: () => {
                fragment.style.clipPath = `circle(0% at ${pos.x}% ${pos.y}%)`;
              },
            });
          });
          return fragments;
        },
        revealTiming: (i, total) => (i / total) * 0.4,
        collapseTiming: (i, total) => ((total - 1 - i) / total) * 0.25,
      },
      curtain: {
        name: "Curtain Sweep",
        create: (container, imageSrc, size) => {
          const fragments: Fragment[] = [];
          const stripCount = 10;
          for (let i = 0; i < stripCount; i++) {
            const fragment = document.createElement("div");
            fragment.className = "image-fragment";
            const bg = document.createElement("div");
            bg.className = "fragment-bg";
            bg.style.backgroundImage = `url(${imageSrc})`;
            const x = (i / stripCount) * 100;
            const w = 100 / stripCount;
            fragment.style.cssText = `
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  clip-path: polygon(${x + w / 2}% 0%, ${x + w / 2}% 0%, ${
              x + w / 2
            }% 100%, ${x + w / 2}% 100%);
                  transition: clip-path ${config.inDuration}ms ${
              config.easing.reveal
            };
                `;
            fragment.appendChild(bg);
            fragments.push({
              element: fragment,
              index: i,
              reveal: () => {
                fragment.style.clipPath = `polygon(${x}% 0%, ${
                  x + w
                }% 0%, ${x + w}% 100%, ${x}% 100%)`;
              },
              collapse: () => {
                fragment.style.clipPath = `polygon(${x + w / 2}% 0%, ${
                  x + w / 2
                }% 0%, ${x + w / 2}% 100%, ${x + w / 2}% 100%)`;
              },
            });
          }
          return fragments;
        },
        revealTiming: (i, total) => (i / total) * 0.6,
        collapseTiming: (i, total) => ((total - 1 - i) / total) * 0.3,
      },
      hexagon: {
        name: "Hexagon Bloom",
        create: (container, imageSrc, size) => {
          const fragments: Fragment[] = [];
          const hexagons = [
            { x: 50, y: 50, size: 20 },
            { x: 25, y: 25, size: 15 },
            { x: 75, y: 25, size: 15 },
            { x: 85, y: 50, size: 15 },
            { x: 75, y: 75, size: 15 },
            { x: 25, y: 75, size: 15 },
            { x: 15, y: 50, size: 15 },
          ];
          hexagons.forEach((hex, i) => {
            const fragment = document.createElement("div");
            fragment.className = "image-fragment";
            const bg = document.createElement("div");
            bg.className = "fragment-bg";
            bg.style.backgroundImage = `url(${imageSrc})`;
            const s = hex.size;
            const x = hex.x;
            const y = hex.y;
            const hexShape = `polygon(${x - s * 0.5}% ${y - s * 0.87}%, ${
              x + s * 0.5
            }% ${y - s * 0.87}%, ${x + s}% ${y}%, ${x + s * 0.5}% ${
              y + s * 0.87
            }%, ${x - s * 0.5}% ${y + s * 0.87}%, ${x - s}% ${y}%)`;
            fragment.style.cssText = `
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  clip-path: polygon(${x}% ${y}%, ${x}% ${y}%, ${x}% ${y}%);
                  transition: clip-path ${config.inDuration}ms ${config.easing.reveal};
                `;
            fragment.appendChild(bg);
            fragments.push({
              element: fragment,
              index: i,
              reveal: () => {
                fragment.style.clipPath = hexShape;
              },
              collapse: () => {
                fragment.style.clipPath = `polygon(${x}% ${y}%, ${x}% ${y}%, ${x}% ${y}%)`;
              },
            });
          });
          return fragments;
        },
        revealTiming: (i, total) => (i === 0 ? 0 : 0.2 + (i - 1) * 0.06),
        collapseTiming: (i, total) => (i === 0 ? 0.3 : (i - 1) * 0.04),
      },
      zoomsplit: {
        name: "Zoom Split",
        create: (container, imageSrc, size) => {
          const fragments: Fragment[] = [];
          const gridSize = 3;
          for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
              const fragment = document.createElement("div");
              fragment.className = "image-fragment";
              const bg = document.createElement("div");
              bg.className = "fragment-bg";
              bg.style.backgroundImage = `url(${imageSrc})`;
              const x = (col / gridSize) * 100;
              const y = (row / gridSize) * 100;
              const w = 100 / gridSize;
              const h = 100 / gridSize;
              fragment.style.cssText = `
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    clip-path: polygon(${x + w / 2}% ${y + h / 2}%, ${
                x + w / 2
              }% ${y + h / 2}%, ${x + w / 2}% ${y + h / 2}%, ${x + w / 2}% ${
                y + h / 2
              }%);
                    transition: clip-path ${config.inDuration}ms ${
                config.easing.scale
              };
                  `;
              fragment.appendChild(bg);
              fragments.push({
                element: fragment,
                index: row * gridSize + col,
                reveal: () => {
                  fragment.style.clipPath = `polygon(${x}% ${y}%, ${
                    x + w
                  }% ${y}%, ${x + w}% ${y + h}%, ${x}% ${y + h}%)`;
                },
                collapse: () => {
                  fragment.style.clipPath = `polygon(${x + w / 2}% ${
                    y + h / 2
                  }%, ${x + w / 2}% ${y + h / 2}%, ${x + w / 2}% ${
                    y + h / 2
                  }%, ${x + w / 2}% ${y + h / 2}%)`;
                },
              });
            }
          }
          return fragments;
        },
        revealTiming: (i, total) => {
          const gridSize = Math.sqrt(total);
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          const centerX = (gridSize - 1) / 2;
          const centerY = (gridSize - 1) / 2;
          const distance = Math.hypot(col - centerX, row - centerY);
          return distance * 0.15;
        },
        collapseTiming: (i, total) => {
          const gridSize = Math.sqrt(total);
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          const centerX = (gridSize - 1) / 2;
          const centerY = (gridSize - 1) / 2;
          const distance = Math.hypot(col - centerX, row - centerY);
          return distance * 0.08;
        },
      },
    };

    interface TrailItem {
      element: HTMLElement;
      rotation?: number;
      removeTime: number;
      isFlame?: boolean;
      fragments?: Fragment[];
      pattern?: string;
    }

    const trail: TrailItem[] = [];
    let mouseX = 0,
      mouseY = 0,
      lastMouseX = 0,
      lastMouseY = 0,
      prevMouseX = 0,
      prevMouseY = 0;
    let isMoving = false,
      isCursorInContainer = false,
      isTouching = false;
    let lastRemovalTime = 0,
      lastTouchImageTime = 0,
      lastScrollTime = 0,
      lastMoveTime = Date.now();
    let isScrolling = false,
      scrollTicking = false;
    let smoothedSpeed = 0,
      maxSpeed = 0;
    let currentEffect = "flame";
    let imageIndex = 0;
    const imagePool: HTMLElement[] = [];

    const isInContainer = (x: number, y: number) => {
      if (!container) return false;
      const rect = container.getBoundingClientRect();
      return (
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      );
    };

    const mouseOverHandler = (e: MouseEvent) => {
      mouseX = lastMouseX = prevMouseX = e.clientX;
      mouseY = lastMouseY = prevMouseY = e.clientY;
      isCursorInContainer = isInContainer(mouseX, mouseY);
      document.removeEventListener("mouseover", mouseOverHandler);
    };

    document.addEventListener("mouseover", mouseOverHandler);

    const hasMovedEnough = () => {
      const dx = mouseX - lastMouseX,
        dy = mouseY - lastMouseY;
      return Math.hypot(dx, dy) > config.mouseThreshold;
    };

    const hasMovedAtAll = () => {
      const dx = mouseX - prevMouseX,
        dy = mouseY - prevMouseY;
      return Math.hypot(dx, dy) > config.minMovementForImage;
    };

    const calculateSpeed = () => {
      const now = Date.now(),
        dt = now - lastMoveTime;
      if (dt <= 0) return 0;
      const dist = Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY);
      const raw = dist / dt;
      if (raw > maxSpeed) maxSpeed = raw;
      const norm = Math.min(raw / (maxSpeed || 0.5), 1);
      smoothedSpeed =
        smoothedSpeed * (1 - config.speedSmoothingFactor) +
        norm * config.speedSmoothingFactor;
      lastMoveTime = now;

      if (config.showSpeedIndicator && speedIndicator) {
        const effectName = PATTERNS[currentEffect].name;
        speedIndicator.textContent = `${effectName} Intensity: ${(
          smoothedSpeed * 100
        ).toFixed(0)}%`;
        speedIndicator.style.opacity = "1";

        (window as any).speedTimeout = setTimeout(
          () => (speedIndicator.style.opacity = "0"),
          1500
        );
      }
      return smoothedSpeed;
    };

    const createImageElement = () => {
      if (imagePool.length > 0) {
        return imagePool.pop()!;
      }
      const element = document.createElement("div");
      element.className = "trail-image";
      return element;
    };

    const returnToPool = (element: HTMLElement) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      element.innerHTML = "";
      element.style.cssText = "";
      element.className = "trail-image";
      if (imagePool.length < 20) {
        imagePool.push(element);
      }
    };

    const createImage = (speed = 0.5) => {
      if (!container) return;
      const imageSrc = images[imageIndex];
      imageIndex = (imageIndex + 1) % images.length;

      const size =
        config.minImageSize +
        (config.maxImageSize - config.minImageSize) * speed;
      const pattern = PATTERNS[currentEffect];

      if (currentEffect === "flame") {
        // Original flame effect
        const img = document.createElement("img");
        img.className = "trail-img";
        const rotFactor = 1 + speed * (config.maxRotationFactor - 1);
        const rot = (Math.random() - 0.5) * config.baseRotation * rotFactor;

        img.src = imageSrc;
        img.width = size;
        img.height = size;
        const rect = container.getBoundingClientRect();
        const x = mouseX - rect.left,
          y = mouseY - rect.top;
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        img.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0)`;
        img.style.transition = `transform ${config.inDuration}ms ${config.inEasing}`;
        container.appendChild(img);

        addTimeout(
          setTimeout(() => {
            img.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(1)`;
          }, 10)
        );

        trail.push({
          element: img,
          rotation: rot,
          removeTime: Date.now() + config.imageLifespan,
          isFlame: true,
        });
      } else {
        const imageContainer = createImageElement();
        const rect = container.getBoundingClientRect();
        const x = mouseX - rect.left,
          y = mouseY - rect.top;

        imageContainer.style.cssText = `
              left: ${x}px;
              top: ${y}px;
              width: ${size}px;
              height: ${size}px;
              transform: translate3d(-50%, -50%, 0) scale(0);
              transition: transform ${config.inDuration}ms ${config.easing.scale};
            `;

        const fragments = pattern.create(imageContainer, imageSrc, size);

        fragments.forEach((fragment) => {
          imageContainer.appendChild(fragment.element);
        });

        container.appendChild(imageContainer);

        requestAnimationFrame(() => {
          imageContainer.style.transform =
            "translate3d(-50%, -50%, 0) scale(1)";
          fragments.forEach((fragment) => {
            const revealTime = pattern.revealTiming(
              fragment.index,
              fragments.length,
              fragment
            );
            const delay = revealTime * config.staggerRange;
            addTimeout(
              setTimeout(() => {
                fragment.reveal();
              }, delay)
            );
          });
        });

        trail.push({
          element: imageContainer,
          fragments,
          pattern: currentEffect,
          removeTime: Date.now() + config.imageLifespan,
        });
      }
    };

    const createTrailImage = () => {
      if (!isCursorInContainer) return;
      if ((isMoving || isTouching) && hasMovedEnough() && hasMovedAtAll()) {
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        const speed = calculateSpeed();
        createImage(speed);
        prevMouseX = mouseX;
        prevMouseY = mouseY;
      }
    };

    const createTouchTrailImage = () => {
      if (!isCursorInContainer || !isTouching || !hasMovedAtAll()) return;
      const now = Date.now();
      if (now - lastTouchImageTime < config.touchImageInterval) return;
      lastTouchImageTime = now;
      const speed = calculateSpeed();
      createImage(speed);
      prevMouseX = mouseX;
      prevMouseY = mouseY;
    };

    const createScrollTrailImage = () => {
      if (!isCursorInContainer || !isScrolling) return;
      lastMouseX +=
        (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
      lastMouseY +=
        (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
      createImage(0.5);
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    const removeOldImages = () => {
      const now = Date.now();
      if (now - lastRemovalTime < config.removalDelay || !trail.length) return;
      if (now >= trail[0].removeTime) {
        const imgObj = trail.shift()!;

        if (imgObj.isFlame) {
          imgObj.element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
          imgObj.element.style.transform = `translate(-50%, -50%) rotate(${
            (imgObj.rotation || 0) + 360
          }deg) scale(0)`;
          addTimeout(
            setTimeout(() => {
              imgObj.element.remove();
            }, config.outDuration)
          );
        } else {
          const { element, fragments, pattern: imagePattern } = imgObj;
          const pattern = PATTERNS[imagePattern!];

          if (fragments) {
            fragments.forEach((fragment) => {
              const collapseTime = pattern.collapseTiming(
                fragment.index,
                fragments.length,
                fragment
              );
              const delay = collapseTime * config.staggerRange;
              addTimeout(
                setTimeout(() => {
                  fragment.collapse();
                }, delay)
              );
            });
          }

          element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
          element.style.transform = "translate3d(-50%, -50%, 0) scale(0)";
          addTimeout(setTimeout(() => returnToPool(element), config.outDuration));
        }

        lastRemovalTime = now;
      }
    };

    const effectLinks = document.querySelectorAll("[data-effect]");
    effectLinks.forEach((link) => {
      const clickHandler = (e: Event) => {
        e.preventDefault();
        effectLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
        currentEffect = (link as HTMLElement).dataset.effect || "flame";
      };
      link.addEventListener("click", clickHandler);
    });

    const mouseMoveHandler = (e: MouseEvent) => {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      isCursorInContainer = isInContainer(mouseX, mouseY);
      if (isCursorInContainer && hasMovedAtAll()) {
        isMoving = true;
        clearTimeout((window as any).moveTimeout);
        (window as any).moveTimeout = setTimeout(() => (isMoving = false), 100);
      }
    };
    document.addEventListener("mousemove", mouseMoveHandler);

    const touchStartHandler = (e: TouchEvent) => {
      const touch = e.touches[0];
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      isCursorInContainer = true;
      isTouching = true;
      lastMoveTime = Date.now();
    };

    const touchMoveHandler = (e: TouchEvent) => {
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - prevMouseX);
      const dy = Math.abs(touch.clientY - prevMouseY);
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      isCursorInContainer = true;
      if (dy > dx) return;
      createTouchTrailImage();
    };

    const touchEndHandler = () => {
      isTouching = false;
    };

    const touchStartDocumentHandler = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!isInContainer(t.clientX, t.clientY)) {
        isCursorInContainer = false;
        isTouching = false;
      }
    };

    container.addEventListener("touchstart", touchStartHandler);
    container.addEventListener("touchmove", touchMoveHandler);
    container.addEventListener("touchend", touchEndHandler);
    document.addEventListener("touchstart", touchStartDocumentHandler);

    const scrollHandler1 = () => {
      isCursorInContainer = isInContainer(mouseX, mouseY);
      if (isCursorInContainer) {
        isScrolling = true;
        clearTimeout((window as any).scrollTimeout);
        (window as any).scrollTimeout = setTimeout(
          () => (isScrolling = false),
          100
        );
      }
    };

    const scrollHandler2 = () => {
      const now = Date.now();
      if (now - lastScrollTime < config.scrollThreshold) return;
      lastScrollTime = now;
      if (!scrollTicking && isCursorInContainer) {
        requestAnimationFrame(() => {
          if (isScrolling) createScrollTrailImage();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener("scroll", scrollHandler1, { passive: true });
    window.addEventListener("scroll", scrollHandler2, { passive: true });

    const animate = () => {
      if (isMoving || isTouching || isScrolling) createTrailImage();
      removeOldImages();
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mouseover", mouseOverHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("touchstart", touchStartDocumentHandler);
      container.removeEventListener("touchstart", touchStartHandler);
      container.removeEventListener("touchmove", touchMoveHandler);
      container.removeEventListener("touchend", touchEndHandler);
      window.removeEventListener("scroll", scrollHandler1);
      window.removeEventListener("scroll", scrollHandler2);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      timeoutsRef.current.forEach(clearTimeout);
      (window as any).speedTimeout && clearTimeout((window as any).speedTimeout);
      (window as any).moveTimeout && clearTimeout((window as any).moveTimeout);
      (window as any).scrollTimeout && clearTimeout((window as any).scrollTimeout);

      const images = document.querySelectorAll(".trail-img, .trail-image");
      images.forEach((img) => img.remove());
      
      // Revert GSAP context
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-black min-h-screen">
      <DoorTransition 
        isTransitioning={isTransitioning} 
        onComplete={() => router.push("/dashboard")} 
      />
      <div className="hero-content w-full h-full">
      <header>
        <div className="home-container">
          <div className="logo-container">
            <div className="logo-circles">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
            </div>
          </div>

          <div className="effects">
            <ul>
              <li>
                <a href="#" data-effect="flame" className="active">
                  Flame
                </a>
              </li>
              <li>
                <a href="#" data-effect="venetian">
                  Venetian
                </a>
              </li>
              <li>
                <a href="#" data-effect="curtain">
                  Curtain
                </a>
              </li>
              <li>
                <a href="#" data-effect="hexagon">
                  Hexagon
                </a>
              </li>
              <li>
                <a href="#" data-effect="liquid">
                  Liquid
                </a>
              </li>
              <li>
                <a href="#" data-effect="zoomsplit">
                  Zoom Split
                </a>
              </li>
            </ul>
          </div>

          <div className="social">
            <ul>
              <li>
                <a href="https://instagram.com">Instagram</a>
              </li>
              <li>
                <a href="https://x.com/">X / Twitter</a>
              </li>
              <li>
                <a href="https://linkedin.com">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="text-columns">
          <div className="text-column">
            <span className="text-item">Silence</span>
            <span className="text-item">Intuition</span>
            <span className="text-item">Source</span>
            <span className="text-item">Awareness</span>
            <span className="text-item">Presence</span>
            <span className="text-item">Breath</span>
            <span className="text-item">Flow</span>
            <span className="text-item">Surrender</span>
            <span className="text-item">Process</span>
            <span className="text-item">Emergence</span>
            <span className="text-item">Channel</span>
            <span className="text-item">Receptivity</span>
            <span className="text-item">Simplicity</span>
            <span className="text-item">Clarity</span>
            <span className="text-item">Vulnerability</span>
          </div>

          <div className="text-column">
            <span className="text-item">Listening</span>
            <span className="text-item">Frequency</span>
            <span className="text-item">Vibration</span>
            <span className="text-item">Resonance</span>
            <span className="text-item">Energy</span>
            <span className="text-item">Field</span>
            <span className="text-item">Dimension</span>
            <span className="text-item">Consciousness</span>
            <span className="text-item">Unity</span>
            <span className="text-item">Form</span>
            <span className="text-item">Function</span>
            <span className="text-item">Beauty</span>
            <span className="text-item">Harmony</span>
            <span className="text-item">Balance</span>
            <span className="text-item">Proportion</span>
          </div>

          <div className="text-column">
            <span className="text-item">Rhythm</span>
            <span className="text-item">Texture</span>
            <span className="text-item">Beyond</span>
            <span className="text-item">Possibility</span>
            <span className="text-item">Potential</span>
            <span className="text-item">Transcendence</span>
            <span className="text-item">Evolution</span>
            <span className="text-item">Transformation</span>
            <span className="text-item">Awakening</span>
            <span className="text-item">Creation</span>
            <span className="text-item">Truth</span>
            <span className="text-item">Nature</span>
            <span className="text-item">Wonder</span>
            <span className="text-item">Mystery</span>
            <span className="text-item">Cosmos</span>
          </div>
        </div>

        <div className="rotated-text">
          <span className="rotated-item">Inspiration</span>
          <span className="rotated-item">Discovery</span>
          <span className="rotated-item">Expression</span>
          <span className="rotated-item">Liberation</span>
          <span className="rotated-item">Manifestation</span>
        </div>

        <svg
          fill="none"
          height="9"
          viewBox="0 0 34 9"
          width="34"
          xmlns="http://www.w3.org/2000/svg"
          className="hero-svg letter-f"
          style={{ position: "absolute", width: "100vw", height: "auto" }}
        >
          <g fill="#fff">
            <path d="m.585938.410156h5.595702v1.341794h-3.41016c-.18359 0-.33007.04688-.43945.14063-.10547.08984-.1582.21484-.1582.375 0 .16797.05273.30078.1582.39844.10938.09375.25586.14062.43945.14062h3.41016v1.34766h-3.35156c-.20313 0-.36328.05859-.48047.17578s-.17578.27734-.17578.48047v4.18945h-1.587892z" />
          </g>
        </svg>

        <svg
          fill="none"
          height="9"
          viewBox="0 0 34 9"
          width="34"
          xmlns="http://www.w3.org/2000/svg"
          className="hero-svg letter-l"
          style={{ position: "absolute", width: "100vw", height: "auto" }}
        >
          <g fill="#fff">
            <path d="m6.96094.410156h1.58789v6.585934c0 .21094.05664.375.16992.49219.11719.11328.2793.16992.48633.16992h3.35152v1.3418h-5.59566z" />
          </g>
        </svg>

        <svg
          fill="none"
          height="9"
          viewBox="0 0 34 9"
          width="34"
          xmlns="http://www.w3.org/2000/svg"
          className="hero-svg letter-a"
          style={{ position: "absolute", width: "100vw", height: "auto" }}
        >
          <g fill="#fff">
            <path d="m14.9941.410156h2.543l2.2793 8.589844h-1.6816l-.17-.65039c-.0117-.05078-.041-.11914-.0878-.20508-.043-.08594-.1192-.16601-.2286-.24023-.1093-.07813-.2519-.11719-.4277-.11719h-1.9922c-.25 0-.4277.06445-.5332.19336-.1055.125-.1758.24805-.2109.36914l-.1641.65039h-1.6113zm.1993 5.302734c-.0118.07031-.0176.13281-.0176.1875 0 .14844.043.27734.1289.38672.0859.10547.2422.1582.4687.1582h.9082c.2266 0 .3829-.05273.4688-.1582.0859-.10938.1289-.23828.1289-.38672 0-.05469-.0059-.11719-.0176-.1875l-.8789-3.82617c-.0078-.04297-.0254-.08008-.0527-.11133-.0235-.03125-.0586-.04687-.1055-.04687-.0859 0-.1367.05273-.1523.1582z" />
          </g>
        </svg>

        <svg
          fill="none"
          height="9"
          viewBox="0 0 34 9"
          width="34"
          xmlns="http://www.w3.org/2000/svg"
          className="hero-svg letter-m"
          style={{ position: "absolute", width: "100vw", height: "auto" }}
        >
          <g fill="#fff">
            <path d="m20.4141.410156h1.5879l1.1367 1.271484c.0703.07813.1465.13867.2285.18164.082.03906.1621.0586.2402.0586.1602 0 .3164-.08008.4688-.24024l1.1426-1.271484h1.6054v8.589844h-1.582v-5.53125c0-.14453-.0371-.25781-.1113-.33984-.0704-.08594-.1621-.12891-.2754-.12891-.125 0-.252.07227-.3809.2168l-.8555.99609h-.0117l-.8496-.96094c-.1133-.13672-.2422-.20507-.3867-.20507-.1055 0-.1934.04101-.2637.12304-.0703.07813-.1054.18946-.1054.33399v5.49609h-1.5879z" />
          </g>
        </svg>

        <svg
          fill="none"
          height="9"
          viewBox="0 0 34 9"
          width="34"
          xmlns="http://www.w3.org/2000/svg"
          className="hero-svg letter-e"
          style={{ position: "absolute", width: "100vw", height: "auto" }}
        >
          <g fill="#fff">
            <path d="m27.9961.410156h5.5957v1.341794h-3.4102c-.1836 0-.33.04688-.4394.14063-.1055.08984-.1582.21484-.1582.375 0 .16797.0527.30078.1582.39844.1094.09375.2558.14062.4394.14062h3.4102v1.34766h-3.3516c-.2031 0-.3632.05859-.4804.17578s-.1758.27734-.1758.48047v2.18554c0 .20313.0586.36524.1758.48633.1172.11719.2773.17578.4804.17578h3.3516v1.3418h-5.5957z" />
          </g>
        </svg>

        <div className="touch-instruction">
          Swipe your finger to see the magic unfold
        </div>
        <div className="cursor-hint">
          Move your cursor to create dynamic trails | Click the nav to switch
          trail effects
        </div>
        <div className="speed-indicator"></div>

      <button onClick={handleStartExperience} className="cta-button">
          Let's Get Started
        </button>
      </section>
      </div> 
    </div>
  );
};

export default HomePage;
