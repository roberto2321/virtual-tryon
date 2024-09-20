"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function QuestionAnswering() {
  const [context, setContext] = useState(
    "The Amazon rainforest, also called Amazon jungle or Amazonia, is a moist broadleaf tropical rainforest in the Amazon biome that covers most of the Amazon basin of South America. The basin is 7,000,000 km2 (2,700,000 sq mi), of which 5,500,000 km2 (2,100,000 sq mi) are covered by the rainforest. This region includes territory belonging to nine nations.",
  )
  const [question, setQuestion] = useState("How large is the Amazon rainforest?")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/text/question-answering", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context: context,
          question: question,
        }),
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
          Question answering extracts answers from a given context. Provide a passage of text and ask a question about
          it.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="context">Context</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Enter the context text..."
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the context..."
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading || !context.trim() || !question.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Finding Answer...
          </>
        ) : (
          "Answer Question"
        )}
      </Button>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Answer:</h3>
                <p className="text-lg font-medium">{result.answer}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Confidence:</h3>
                <div className="flex items-center gap-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${result.score * 100}%` }} />
                  </div>
                  <span className="text-sm">{(result.score * 100).toFixed(2)}%</span>
                </div>
              </div>

              {result.start !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location in Context:</h3>
                  <p className="text-sm">
                    Characters {result.start} to {result.end}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
