"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function FeatureExtraction() {
  const [input, setInput] = useState("The quick brown fox jumps over the lazy dog.")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/text/feature-extraction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
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
          Feature extraction converts text into numerical vectors (embeddings) that capture semantic meaning. These
          vectors can be used for similarity comparison, clustering, and other NLP tasks.
        </p>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text for feature extraction..."
          className="min-h-[100px]"
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading || !input.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Extracting Features...
          </>
        ) : (
          "Extract Features"
        )}
      </Button>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Feature Vector:</h3>
            <div className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-[200px]">
              <p className="font-mono">
                {result.slice(0, 20).map((value: number, index: number) => (
                  <span key={index}>
                    {value.toFixed(4)}
                    {index < 19 ? ", " : "..."}
                  </span>
                ))}
              </p>
              <p className="mt-2 text-muted-foreground">Showing first 20 of {result.length} dimensions</p>
            </div>

            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Vector Statistics:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Dimensions:</span> {result.length}
                </div>
                <div>
                  <span className="text-muted-foreground">Mean:</span>{" "}
                  {result.reduce((a: number, b: number) => a + b, 0) / result.length}
                </div>
                <div>
                  <span className="text-muted-foreground">Min:</span> {Math.min(...result).toFixed(4)}
                </div>
                <div>
                  <span className="text-muted-foreground">Max:</span> {Math.max(...result).toFixed(4)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
