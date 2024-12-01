"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Download, AlertCircle, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"

export default function TextToImage() {
  const [prompt, setPrompt] = useState("A beautiful sunset over mountains with a lake in the foreground")
  const [model, setModel] = useState("runwayml/stable-diffusion-v1-5")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<any>(null)

  const models = [
    { id: "runwayml/stable-diffusion-v1-5", name: "Stable Diffusion v1.5" },
    { id: "CompVis/stable-diffusion-v1-4", name: "Stable Diffusion v1.4" },
    { id: "stabilityai/stable-diffusion-2-1", name: "Stable Diffusion 2.1" },
    { id: "stabilityai/stable-diffusion-2", name: "Stable Diffusion 2.0" },
  ]

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      // Get API key from localStorage
      const apiKey = localStorage.getItem("huggingface_api_key")

      const response = await fetch("/api/image/text-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          model: model,
          apiKey: apiKey,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError({
          type: errorData.error || "unknown",
          message: errorData.message || `Error: ${response.status}`,
          details: errorData.details || null,
        })
        return
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setResult(imageUrl)
    } catch (error: any) {
      console.error("Error:", error)
      setError({
        type: "network_error",
        message: error.message || "Failed to generate image. Please try a different model or prompt.",
        details: null,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      const a = document.createElement("a")
      a.href = result
      a.download = `generated-image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const getErrorContent = () => {
    if (!error) return null

    switch (error.type) {
      case "model_unavailable":
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Model Unavailable</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{error.message}</p>
              <p className="text-sm">Try selecting a different model from the dropdown above.</p>
            </AlertDescription>
          </Alert>
        )

      case "quota_exceeded":
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Quota Exceeded</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{error.message}</p>
              {error.details && <p className="text-sm">{error.details}</p>}
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://huggingface.co/pricing", "_blank")}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Upgrade to Pro
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )

      case "invalid_api_key":
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Invalid API Key</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{error.message}</p>
              <p className="text-sm">Please check your API key in the settings.</p>
            </AlertDescription>
          </Alert>
        )

      default:
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Text-to-image generates images from text descriptions. Enter a detailed prompt to create an image.
        </p>

        <div className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="min-h-[100px]"
          />

          <div>
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading || !prompt.trim()} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Image...
          </>
        ) : (
          "Generate Image"
        )}
      </Button>

      {getErrorContent()}

      {result && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative w-full aspect-square">
                <Image
                  src={result || "/placeholder.svg"}
                  alt="Generated image"
                  fill
                  className="object-contain rounded-md"
                />
              </div>

              <Button onClick={handleDownload} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
