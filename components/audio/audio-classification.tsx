"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, Play, Pause } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AudioClassification() {
  const [audio, setAudio] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const audioUrl = URL.createObjectURL(selectedFile)
      setAudio(audioUrl)
      setResult(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.type.startsWith("audio/")) {
      setFile(droppedFile)
      const audioUrl = URL.createObjectURL(droppedFile)
      setAudio(audioUrl)
      setResult(null)
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSubmit = async () => {
    if (!file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("audio", file)

      const response = await fetch("/api/audio/classification", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Audio classification identifies sounds in audio files. Upload an audio file to see how it's classified.
        </p>

        <div
          className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" />

          {audio ? (
            <div className="w-full">
              <audio ref={audioRef} src={audio} className="hidden" onEnded={() => setIsPlaying(false)} />
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePlayPause()
                  }}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <span className="text-sm">{file?.name}</span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Drag and drop an audio file, or click to select</p>
            </div>
          )}
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading || !file} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Classifying Audio...
          </>
        ) : (
          "Classify Audio"
        )}
      </Button>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Classification Results:</h3>
            <div className="space-y-2">
              {result.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${item.score * 100}%` }} />
                    </div>
                    <Badge variant="outline">{(item.score * 100).toFixed(2)}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
