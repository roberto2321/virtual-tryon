"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Translation() {
  const [input, setInput] = useState("Hello, how are you doing today? I hope you're having a great day!")
  const [targetLang, setTargetLang] = useState("fr")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const languages = [
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
  ]

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/text/translation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
          target_language: targetLang,
        }),
      })

      const data = await response.json()
      setResult(data.translation)
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
          Translation converts text from one language to another. Enter text in English and select a target language.
        </p>

        <div className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to translate..."
            className="min-h-[100px]"
          />

          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger>
              <SelectValue placeholder="Select target language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading || !input.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Translating...
          </>
        ) : (
          "Translate Text"
        )}
      </Button>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Translation ({languages.find((l) => l.code === targetLang)?.name}):</h3>
            <p className="text-sm bg-muted p-3 rounded-md">{result}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
