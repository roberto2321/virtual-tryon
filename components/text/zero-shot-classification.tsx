"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, X, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ZeroShotClassification() {
  const [input, setInput] = useState("I recently upgraded my iPhone and I'm loving the camera quality!")
  const [labels, setLabels] = useState<string[]>(["technology", "photography", "travel", "food"])
  const [newLabel, setNewLabel] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAddLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()])
      setNewLabel("")
    }
  }

  const handleRemoveLabel = (label: string) => {
    setLabels(labels.filter((l) => l !== label))
  }

  const handleSubmit = async () => {
    if (labels.length === 0) return

    setLoading(true)
    setError(null)
    try {
      // Get API key from localStorage
      const apiKey = localStorage.getItem("huggingface_api_key")

      const response = await fetch("/api/text/zero-shot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
          labels: labels,
          apiKey: apiKey,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to classify text")
        setResult(null)
        return
      }

      setResult(data)
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message || "An error occurred while classifying the text")
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to safely render results
  const renderResults = () => {
    if (!result || !result.labels || !result.scores) return null

    // Ensure labels and scores are arrays
    const labels = Array.isArray(result.labels) ? result.labels : [result.labels]
    const scores = Array.isArray(result.scores) ? result.scores : [result.scores]

    return (
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-2">Classification Results:</h3>
          <div className="space-y-2">
            {labels.map((label: string, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span>{label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(scores[index] || 0) * 100}%` }} />
                  </div>
                  <Badge variant="outline">{((scores[index] || 0) * 100).toFixed(2)}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Zero-shot classification lets you classify text without training on specific categories. Enter text and define
          your own categories to see how it's classified.
        </p>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to classify..."
          className="min-h-[100px] mb-4"
        />

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Add a category label..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddLabel()
                }
              }}
            />
            <Button type="button" size="icon" onClick={handleAddLabel} disabled={!newLabel.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {labels.map((label) => (
              <Badge key={label} variant="secondary" className="flex items-center gap-1">
                {label}
                <button onClick={() => handleRemoveLabel(label)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {labels.length === 0 && (
              <span className="text-sm text-muted-foreground">Add at least one category label</span>
            )}
          </div>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading || !input.trim() || labels.length === 0}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Classifying...
          </>
        ) : (
          "Classify Text"
        )}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {renderResults()}
    </div>
  )
}
