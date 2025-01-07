"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function ImageToText() {
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [task, setTask] = useState("image-captioning")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const tasks = [
    { id: "image-captioning", name: "Image Captioning" },
    { id: "visual-question-answering", name: "Visual Question Answering" },
    { id: "document-question-answering", name: "Document Question Answering" },
  ]

  const [question, setQuestion] = useState("What can you see in this image?")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
      setResult(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(droppedFile)
      setResult(null)
    }
  }

  const handleSubmit = async () => {
    if (!file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("task", task)

      if (task === "visual-question-answering" || task === "document-question-answering") {
        formData.append("question", question)
      }

      const response = await fetch("/api/multimodal/image-to-text", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setResult(data.text)
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
          Image-to-text converts visual information into text. Upload an image to generate captions or answer questions
          about it.
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="task">Task</Label>
            <Select value={task} onValueChange={setTask}>
              <SelectTrigger id="task">
                <SelectValue placeholder="Select task" />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(task === "visual-question-answering" || task === "document-question-answering") && (
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the image..."
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          )}

          <div
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

            {image ? (
              <div className="relative w-full max-w-xs mx-auto aspect-square">
                <Image src={image || "/placeholder.svg"} alt="Uploaded image" fill className="object-contain" />
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Drag and drop an image, or click to select</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={
          loading ||
          !file ||
          (["visual-question-answering", "document-question-answering"].includes(task) && !question.trim())
        }
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : task === "image-captioning" ? (
          "Generate Caption"
        ) : (
          "Answer Question"
        )}
      </Button>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">{task === "image-captioning" ? "Caption:" : "Answer:"}</h3>
            <p className="text-lg bg-muted p-3 rounded-md">{result}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
