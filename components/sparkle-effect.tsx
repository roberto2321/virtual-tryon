"use client"

import { useEffect, useState } from "react"

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  color: string
  delay: number
  duration: number
}

export default function SparkleEffect() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const createSparkle = (): Sparkle => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1, // Much smaller: 1-3px
      opacity: Math.random() * 0.6 + 0.4, // More consistent opacity
      color: ["#ffffff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1"][Math.floor(Math.random() * 6)], // Softer colors
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2, // 2-5 seconds
    })

    // Create initial sparkles
    const initialSparkles = Array.from({ length: 30 }, createSparkle)
    setSparkles(initialSparkles)

    const interval = setInterval(() => {
      setSparkles((prev) => {
        // Remove old sparkles and add new ones
        const filtered = prev.filter((sparkle) => sparkle.opacity > 0.1)
        if (filtered.length < 25) {
          return [...filtered, createSparkle()]
        }
        return filtered
      })
    }, 800) // Less frequent creation

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setSparkles((prev) =>
        prev.map((sparkle) => ({
          ...sparkle,
          opacity: sparkle.opacity - 0.008, // Slower fade
        })),
      )
    }, 100)

    return () => clearInterval(fadeInterval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            opacity: sparkle.opacity,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        >
          {/* Star shape using CSS */}
          <div
            className="relative"
            style={{
              width: sparkle.size,
              height: sparkle.size,
            }}
          >
            {/* Horizontal line */}
            <div
              className="absolute top-1/2 left-0 transform -translate-y-1/2"
              style={{
                width: sparkle.size,
                height: sparkle.size * 0.15,
                backgroundColor: sparkle.color,
                borderRadius: "1px",
                boxShadow: `0 0 ${sparkle.size * 3}px ${sparkle.color}40`,
                animation: "sparkle-twinkle 3s ease-in-out infinite",
              }}
            />
            {/* Vertical line */}
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
              style={{
                width: sparkle.size * 0.15,
                height: sparkle.size,
                backgroundColor: sparkle.color,
                borderRadius: "1px",
                boxShadow: `0 0 ${sparkle.size * 3}px ${sparkle.color}40`,
                animation: "sparkle-twinkle 3s ease-in-out infinite",
              }}
            />
            {/* Diagonal lines for 4-point star */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45"
              style={{
                width: sparkle.size * 0.7,
                height: sparkle.size * 0.1,
                backgroundColor: sparkle.color,
                borderRadius: "1px",
                boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}30`,
                animation: "sparkle-twinkle 3s ease-in-out infinite 0.5s",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45"
              style={{
                width: sparkle.size * 0.7,
                height: sparkle.size * 0.1,
                backgroundColor: sparkle.color,
                borderRadius: "1px",
                boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}30`,
                animation: "sparkle-twinkle 3s ease-in-out infinite 1s",
              }}
            />
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes sparkle-twinkle {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}
