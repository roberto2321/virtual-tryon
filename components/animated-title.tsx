"use client"

import { useEffect, useState } from "react"

export default function AnimatedTitle() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative">
      <h1
        className={`text-6xl md:text-8xl font-bold mb-4 transition-all duration-1000 ${
          isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
        }`}
        style={{
          background: "linear-gradient(45deg, #ff6b9d, #c44569, #f8b500, #00d2d3, #ff9ff3, #54a0ff)",
          backgroundSize: "400% 400%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "gradient-shift 4s ease infinite, text-glow 2s ease-in-out infinite alternate",
          textShadow: "0 0 30px rgba(255, 107, 157, 0.5), 0 0 60px rgba(196, 69, 105, 0.3)",
          filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))",
        }}
      >
        Hugging Face
      </h1>
      <div
        className={`text-2xl md:text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
        }`}
      >
        AI Explorer
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes text-glow {
          0% { filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 20px rgba(255, 107, 157, 0.3)); }
          100% { filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 40px rgba(255, 107, 157, 0.6)); }
        }
      `}</style>
    </div>
  )
}
