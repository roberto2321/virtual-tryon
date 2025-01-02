"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export default function Summarization() {
  const [input, setInput] = useState(
    "The Amazon rainforest, also called Amazon jungle or Amazonia, is a moist broadleaf tropical rainforest in the Amazon biome that covers most of the Amazon basin of South America. The basin is 7,000,000 km2 (2,700,000 sq mi), of which 5,500,000 km2 (2,100,000 sq mi) are covered by the rainforest. This region includes territory belonging to nine nations. The majority of the forest is contained within Brazil, with 60% of the rainforest, followed by Peru with 13%, Colombia with 10%, and with minor amounts in Venezuela, Ecuador, Bolivia, Guyana, Suriname, and French Guiana. The Amazon represents over half of the planet's remaining rainforests, and comprises the largest and most biodiverse tract of tropical rainforest in the world, with an estimated 390 billion individual trees divided into 16,000 species.",
  )
  const [maxLength, setMaxLength] = useState(100)
  const [minLength, setMinLength] = useState(30)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/text/summarization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
          max_length: maxLength,
          min_length: minLength,
        }),
      })

      const data = await response.json()
      setResult(data.summary)
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
          Text summarization condenses long text into shorter versions while preserving key information. Enter a long
          text passage to generate a concise summary.
        </p>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to summarize..."
          className="min-h-[200px]"
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="min-length">Minimum Length: {minLength} characters</Label>
          </div>
          <Slider
            id="min-length"
            min={10}
            max={200}
            step={10}
            value={[minLength]}
            onValueChange={(value) => setMinLength(value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="max-length">Maximum Length: {maxLength} characters</Label>
          </div>
          <Slider
            id="max-length"
            min={50}
            max={500}
            step={10}
            value={[maxLength]}
            onValueChange={(value) => setMaxLength(value[0])}
          />
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading || !input.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Summarizing...
          </>
        ) : (
          "Summarize Text"
        )}
      </Button>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Summary:</h3>
            <p className="text-sm bg-muted p-3 rounded-md">{result}</p>

            <div className="mt-4 text-xs text-muted-foreground">
              <p>Original length: {input.length} characters</p>
              <p>Summary length: {result.length} characters</p>
              <p>Reduction: {((1 - result.length / input.length) * 100).toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
