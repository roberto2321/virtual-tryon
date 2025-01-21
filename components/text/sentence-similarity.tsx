"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function SentenceSimilarity() {
  const [sentence1, setSentence1] = useState("The cat sat on the mat.")
  const [sentence2, setSentence2] = useState("A cat is sitting on a mat.")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<number | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/text/sentence-similarity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sentence1: sentence1,
          sentence2: sentence2,
        }),
      })

      const data = await response.json()
      setResult(data.similarity)
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
          Sentence similarity measures how semantically similar two sentences are. Enter two sentences to compare their
          meaning.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sentence 1</label>
            <Textarea
              value={sentence1}
              onChange={(e) => setSentence1(e.target.value)}
              placeholder="Enter first sentence..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sentence 2</label>
            <Textarea
              value={sentence2}
              onChange={(e) => setSentence2(e.target.value)}
              placeholder="Enter second sentence..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading || !sentence1.trim() || !sentence2.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculating Similarity...
          </>
        ) : (
          "Calculate Similarity"
        )}
      </Button>

      {result !== null && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Similarity Score:</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Different</span>
                <span className="text-sm text-muted-foreground">Identical</span>
              </div>
              <Progress value={result * 100} className="h-4" />
              <div className="text-center text-lg font-medium mt-2">{(result * 100).toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground text-center mt-2">
                {result < 0.3
                  ? "These sentences have very different meanings."
                  : result < 0.7
                    ? "These sentences have somewhat similar meanings."
                    : "These sentences have very similar meanings."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
