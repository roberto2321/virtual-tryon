"use client"

import { useState, useEffect, Suspense } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import TextDemo from "@/components/text-demo"
import ImageDemo from "@/components/image-demo"
import AudioDemo from "@/components/audio-demo"
import MultimodalDemo from "@/components/multimodal-demo"
import ApiKeySettings from "@/components/api-key-settings"
import ThreeBackground from "@/components/three-background"
import SparkleEffect from "@/components/sparkle-effect"
import AnimatedTitle from "@/components/animated-title"
import LottieLoader from "@/components/lottie-loader"
import LottieTabs from "@/components/lottie-tabs"

export default function Home() {
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState<string>("")
  const [activeTab, setActiveTab] = useState("text")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem("huggingface_api_key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }

    // Simulate loading
    setTimeout(() => setIsLoaded(true), 2000)
  }, [])

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey)
    if (newApiKey) {
      localStorage.setItem("huggingface_api_key", newApiKey)
    } else {
      localStorage.removeItem("huggingface_api_key")
    }
  }

  if (!isLoaded) {
    return <LottieLoader />
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Three.js Background - now much more subtle */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={<div className="bg-black w-full h-full" />}>
          <ThreeBackground />
        </Suspense>
      </div>

      {/* Dark overlay to ensure text readability */}
      <div className="fixed inset-0 z-1 bg-black/40" />

      {/* Sparkle Effect */}
      <SparkleEffect />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto py-10">
        <div className="flex items-center justify-between mb-12">
          <div className="text-center flex-1">
            <AnimatedTitle />
            <p className="max-w-2xl mx-auto text-gray-200 text-lg leading-relaxed mt-6 drop-shadow-lg">
              Explore the limitless capabilities of Hugging Face's Inference API across different modalities. Experience
              the future of AI with our interactive playground.
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="ml-4 bg-black/70 border-purple-500/50 hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300 backdrop-blur-sm"
          >
            <Settings className="h-4 w-4 text-purple-400" />
          </Button>
        </div>

        <div className="backdrop-blur-md bg-black/50 rounded-3xl border border-purple-500/20 p-8 shadow-2xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <LottieTabs activeTab={activeTab} />

            <TabsContent value="text" className="animate-in fade-in-50 duration-500">
              <TextDemo />
            </TabsContent>

            <TabsContent value="images" className="animate-in fade-in-50 duration-500">
              <ImageDemo />
            </TabsContent>

            <TabsContent value="audio" className="animate-in fade-in-50 duration-500">
              <AudioDemo />
            </TabsContent>

            <TabsContent value="multimodal" className="animate-in fade-in-50 duration-500">
              <MultimodalDemo />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ApiKeySettings
        open={showSettings}
        onOpenChange={setShowSettings}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
      />
    </div>
  )
}
