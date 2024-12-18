"use client"

import { useState } from "react"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import Lottie from "lottie-react"

// Import Lottie animations
import textAnimation from "@/animations/text-animation.json"
import imageAnimation from "@/animations/image-animation.json"
import audioAnimation from "@/animations/audio-animation.json"
import multimodalAnimation from "@/animations/multimodal-animation.json"

interface LottieTabsProps {
  activeTab: string
}

export default function LottieTabs({ activeTab }: LottieTabsProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  return (
    <TabsList className="grid grid-cols-4 mb-8 bg-black/70 border border-purple-500/30 rounded-2xl p-2 backdrop-blur-sm">
      <TabsTrigger
        value="text"
        className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all duration-300 flex flex-col items-center py-3 ${
          activeTab === "text" ? "text-white" : "text-gray-400"
        }`}
        onMouseEnter={() => setHoveredTab("text")}
        onMouseLeave={() => setHoveredTab(null)}
      >
        <div className="w-10 h-4">
          <Lottie
            animationData={textAnimation}
            loop={activeTab === "text" || hoveredTab === "text"}
            autoplay={activeTab === "text" || hoveredTab === "text"}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <span className="text-xs font-medium">Text</span>
      </TabsTrigger>

      <TabsTrigger
        value="images"
        className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl transition-all duration-300 flex flex-col items-center py-3 ${
          activeTab === "images" ? "text-white" : "text-gray-400"
        }`}
        onMouseEnter={() => setHoveredTab("images")}
        onMouseLeave={() => setHoveredTab(null)}
      >
        <div className="w-10 h-4">
          <Lottie
            animationData={imageAnimation}
            loop={activeTab === "images" || hoveredTab === "images"}
            autoplay={activeTab === "images" || hoveredTab === "images"}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <span className="text-xs font-medium">Images</span>
      </TabsTrigger>

      <TabsTrigger
        value="audio"
        className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl transition-all duration-300 flex flex-col items-center py-3 ${
          activeTab === "audio" ? "text-white" : "text-gray-400"
        }`}
        onMouseEnter={() => setHoveredTab("audio")}
        onMouseLeave={() => setHoveredTab(null)}
      >
        <div className="w-10 h-4">
          <Lottie
            animationData={audioAnimation}
            loop={activeTab === "audio" || hoveredTab === "audio"}
            autoplay={activeTab === "audio" || hoveredTab === "audio"}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <span className="text-xs font-medium">Audio</span>
      </TabsTrigger>

      <TabsTrigger
        value="multimodal"
        className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-xl transition-all duration-300 flex flex-col items-center py-3 ${
          activeTab === "multimodal" ? "text-white" : "text-gray-400"
        }`}
        onMouseEnter={() => setHoveredTab("multimodal")}
        onMouseLeave={() => setHoveredTab(null)}
      >
        <div className="w-10 h-4">
          <Lottie
            animationData={multimodalAnimation}
            loop={activeTab === "multimodal" || hoveredTab === "multimodal"}
            autoplay={activeTab === "multimodal" || hoveredTab === "multimodal"}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <span className="text-xs font-medium">Multimodal</span>
      </TabsTrigger>
    </TabsList>
  )
}
