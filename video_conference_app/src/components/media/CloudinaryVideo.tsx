"use client"

import { CldVideoPlayer } from "next-cloudinary"
import "next-cloudinary/dist/cld-video-player.css"

interface CloudinaryVideoProps {
  publicId: string
  className?: string
  priority?: boolean
}

export default function CloudinaryVideo({
  publicId,
  className = "",
}: CloudinaryVideoProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <CldVideoPlayer
        src={publicId}
        autoplay
        muted
        loop
        controls={false}
        playsInline
        preload="auto"
        width="1920"
        height="1080"
        className="object-cover w-full h-full"
      />
    </div>
  )
}
