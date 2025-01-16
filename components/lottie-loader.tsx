"use client"

import { useEffect, useState } from "react"

export default function LottieLoader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 40)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div
            className="w-24 h-24 mx-auto rounded-full border-4 border-purple-500/30 animate-spin"
            style={{
              borderTopColor: "#8b5cf6",
              animation: "spin 1s linear infinite",
            }}
          />
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 animate-pulse" />
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-white mb-4 animate-pulse">Initializing AI Explorer</h2>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto mb-4">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Text */}
        <p className="text-gray-400 text-sm">
          {progress < 30 && "Loading models..."}
          {progress >= 30 && progress < 60 && "Preparing interface..."}
          {progress >= 60 && progress < 90 && "Connecting to API..."}
          {progress >= 90 && "Almost ready!"}
        </p>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-500 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
