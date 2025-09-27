'use client'

import React, { useEffect, useRef, useState } from 'react'
import { trackVideoPlay } from '@/lib/analytics'

interface VideoPlayerProps {
  srcMp4?: string
  srcWebm?: string
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  playsInline?: boolean
  className?: string
  id?: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  srcMp4,
  srcWebm,
  poster,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  className,
  id,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [hasTracked, setHasTracked] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const onPlay = () => {
      if (!hasTracked) {
        trackVideoPlay(id || (srcMp4 || srcWebm || 'video'))
        setHasTracked(true)
      }
    }

    el.addEventListener('play', onPlay)
    return () => el.removeEventListener('play', onPlay)
  }, [hasTracked, id, srcMp4, srcWebm])

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload="metadata"
    >
      {srcWebm && <source src={srcWebm} type="video/webm" />}
      {srcMp4 && <source src={`${srcMp4}#t=0.1`} type="video/mp4" />}
    </video>
  )
}


