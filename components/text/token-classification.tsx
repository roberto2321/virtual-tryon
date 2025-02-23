"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TokenClassification() {
  const [input, setInput] = useState(
    "Apple Inc. is headquartered in Cupertino, California and was founded by Steve Jobs, Steve Wozniak, and Ronald Wayne.",
  )
  const [task, setTask] = useState("ner")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/text/token-classification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
          task: task,
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

  // Function to render the text with highlighted entities
  const renderHighlightedText = () => {
    if (!result || !input) return input

    // Sort entities by start index in descending order to avoid index shifting
    const sortedEntities = [...result].sort((a, b) => b.start - a.start)

    let highlightedText = input

    // Color map for different entity types
    const colorMap: Record<string, string> = {
      PERSON: "bg-blue-100 text-blue-800",
      ORG: "bg-green-100 text-green-800",
      LOC: "bg-yellow-100 text-yellow-800",
      MISC: "bg-purple-100 text-purple-800",
      PER: "bg-blue-100 text-blue-800",
      LOCATION: "bg-yellow-100 text-yellow-800",
      ORGANIZATION: "bg-green-100 text-green-800",
      DATE: "bg-red-100 text-red-800",
      TIME: "bg-orange-100 text-orange-800",
      MONEY: "bg-emerald-100 text-emerald-800",
      PERCENT: "bg-pink-100 text-pink-800",
      GPE: "bg-yellow-100 text-yellow-800",
      FACILITY: "bg-indigo-100 text-indigo-800",
      PRODUCT: "bg-cyan-100 text-cyan-800",
      EVENT: "bg-violet-100 text-violet-800",
      WORK_OF_ART: "bg-rose-100 text-rose-800",
      LAW: "bg-amber-100 text-amber-800",
      LANGUAGE: "bg-lime-100 text-lime-800",
      NORP: "bg-fuchsia-100 text-fuchsia-800",
      CARDINAL: "bg-teal-100 text-teal-800",
      ORDINAL: "bg-sky-100 text-sky-800",
      QUANTITY: "bg-emerald-100 text-emerald-800",
    }

    // Replace each entity with a highlighted span
    sortedEntities.forEach((entity) => {
      const entityText = highlightedText.substring(entity.start, entity.end)
      const colorClass = colorMap[entity.entity_group] || "bg-gray-100 text-gray-800"

      const highlightedEntity = `<span class="${colorClass} px-1 rounded" title="${entity.entity_group}">${entityText}</span>`

      highlightedText =
        highlightedText.substring(0, entity.start) + highlightedEntity + highlightedText.substring(entity.end)
    })

    return highlightedText
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Token classification identifies specific elements in text, like named entities (people, organizations,
          locations). Try entering text with names, places, or organizations.
        </p>
        <div className="flex gap-2 mb-2">
          <Select value={task} onValueChange={setTask}>
            <SelectTrigger>
              <SelectValue placeholder="Select task" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ner">Named Entity Recognition</SelectItem>
              <SelectItem value="pos">Part-of-Speech Tagging</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text for token classification..."
          className="min-h-[100px]"
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading || !input.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Identify Tokens"
        )}
      </Button>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Identified Tokens:</h3>
            <div className="p-3 bg-muted rounded-md" dangerouslySetInnerHTML={{ __html: renderHighlightedText() }} />

            <div className="mt-4 space-y-1">
              <h4 className="text-sm font-medium">Legend:</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(result.map((item: any) => item.entity_group))).map((type: string) => {
                  const colorClass =
                    {
                      PERSON: "bg-blue-100 text-blue-800",
                      ORG: "bg-green-100 text-green-800",
                      LOC: "bg-yellow-100 text-yellow-800",
                      MISC: "bg-purple-100 text-purple-800",
                      PER: "bg-blue-100 text-blue-800",
                      LOCATION: "bg-yellow-100 text-yellow-800",
                      ORGANIZATION: "bg-green-100 text-green-800",
                      DATE: "bg-red-100 text-red-800",
                    }[type as string] || "bg-gray-100 text-gray-800"

                  return (
                    <span key={type as string} className={`${colorClass} px-2 py-0.5 text-xs rounded`}>
                      {type as string}
                    </span>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
