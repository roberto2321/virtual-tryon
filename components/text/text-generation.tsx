"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TextGeneration() {
  const [prompt, setPrompt] = useState("Write a short poem about artificial intelligence.")
  const [maxLength, setMaxLength] = useState(100)
  const [temperature, setTemperature] = useState(0.7)
  const [model, setModel] = useState("gpt2")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const models = [
    { id: "gpt2", name: "GPT-2" },
    { id: "distilgpt2", name: "DistilGPT-2" },
    { id: "EleutherAI/gpt-neo-125M", name: "GPT-Neo (125M)" },
  ]

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/text/generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          max_length: maxLength,
          temperature: temperature,
          model: model,
        }),
      })

      const data = await response.json()
      setResult(data.generated_text)
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
          Text generation creates new text based on a prompt. Enter a prompt to generate creative text.
        </p>

        <div className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt..."
            className="min-h-[100px]"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="max-length">Max Length: {maxLength}</Label>
              </div>
              <Slider
                id="max-length"
                min={10}
                max={500}
                step={10}
                value={[maxLength]}
                onValueChange={(value) => setMaxLength(value[0])}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex justify-between">
                <Label htmlFor="temperature">Temperature: {temperature.toFixed(1)}</Label>
              </div>
              <Slider
                id="temperature"
                min={0.1}
                max={1.5}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Lower values produce more predictable text, higher values produce more creative text.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading || !prompt.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Text"
        )}
      </Button>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Generated Text:</h3>
            <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">{result}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
