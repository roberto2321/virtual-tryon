"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Play, Pause, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function TextToSpeech() {
  const [text, setText] = useState(
    "Hello, this is a test of the text to speech functionality using Hugging Face models.",
  )
  const [voice, setVoice] = useState("facebook/mms-tts-eng")
  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const voices = [
    { id: "facebook/mms-tts-eng", name: "MMS TTS (English)" },
    { id: "espnet/kan-bayashi_ljspeech_vits", name: "VITS (LJSpeech)" },
    { id: "microsoft/speecht5_tts", name: "SpeechT5" },
  ]

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/audio/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          model: voice,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
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

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement("a")
      a.href = audioUrl
      a.download = `tts-audio-${Date.now()}.wav`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Text-to-speech converts written text into spoken words. Enter text to generate speech.
        </p>

        <div className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to speech..."
            className="min-h-[100px]"
          />

          <div>
            <Label htmlFor="voice">Voice Model</Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger id="voice">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading || !text.trim()} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Speech...
          </>
        ) : (
          "Generate Speech"
        )}
      </Button>

      {audioUrl && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />

              <div className="flex items-center justify-center space-x-4">
                <Button onClick={togglePlayPause} variant="outline" size="icon">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  {audioRef.current && (
                    <div
                      className="h-full bg-primary transition-all duration-100"
                      style={{
                        width: `${(audioRef.current.currentTime / audioRef.current.duration) * 100 || 0}%`,
                      }}
                    />
                  )}
                </div>

                <Button onClick={handleDownload} variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
