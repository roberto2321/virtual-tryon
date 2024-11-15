import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

// Create a new Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const imageFile = formData.get("image") as File
    const task = formData.get("task") as string
    const question = formData.get("question") as string

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const imageBuffer = await imageFile.arrayBuffer()
    let result

    switch (task) {
      case "image-captioning":
        result = await Hf.imageToText({
          model: "Salesforce/blip-image-captioning-base",
          data: new Uint8Array(imageBuffer),
        })
        return NextResponse.json({ text: result.generated_text })

      case "visual-question-answering":
        result = await Hf.visualQuestionAnswering({
          model: "dandelin/vilt-b32-finetuned-vqa",
          inputs: {
            image: new Uint8Array(imageBuffer),
            question: question,
          },
        })
        return NextResponse.json({ text: result.answer })

      case "document-question-answering":
        result = await Hf.documentQuestionAnswering({
          model: "impira/layoutlm-document-qa",
          inputs: {
            image: new Uint8Array(imageBuffer),
            question: question,
          },
        })
        return NextResponse.json({ text: result.answer })

      default:
        return NextResponse.json({ error: "Invalid task" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in image-to-text:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}
