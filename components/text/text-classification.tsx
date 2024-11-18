"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CreditCard, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function TextClassification() {
  const [input, setInput] = useState("I love this product! It's amazing and works perfectly.")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<any>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      // Get API key from localStorage
      const apiKey = localStorage.getItem("huggingface_api_key")

      const response = await fetch("/api/text/classification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
          apiKey: apiKey,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError({
          type: data.error || "unknown",
          message: data.message || "Failed to classify text",
          details: data.details || null,
        })
        setResult(null)
        return
      }

      setResult(data)
    } catch (error: any) {
      console.error("Error:", error)
      setError({
        type: "network_error",
        message: "Network error occurred. Please check your connection and try again.",
        details: null,
      })
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const getErrorContent = () => {
    if (!error) return null

    switch (error.type) {
      case "quota_exceeded":
        return (
          <Alert variant="destructive">
            <CreditCard className="h-4 w-4" />
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

      case "model_unavailable":
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Model Unavailable</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
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
          Text classification analyzes text and assigns predefined categories or labels. Try entering a product review,
          tweet, or any text to see how it's classified.
        </p>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to classify..."
          className="min-h-[100px]"
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading || !input.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Classifying...
          </>
        ) : (
          "Classify Text"
        )}
      </Button>

      {error && getErrorContent()}

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Classification Results:</h3>
            <div className="space-y-2">
              {Array.isArray(result) ? (
                result.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${item.score * 100}%` }} />
                      </div>
                      <Badge variant="outline">{(item.score * 100).toFixed(2)}%</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between">
                  <span>{result.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${result.score * 100}%` }} />
                    </div>
                    <Badge variant="outline">{(result.score * 100).toFixed(2)}%</Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
