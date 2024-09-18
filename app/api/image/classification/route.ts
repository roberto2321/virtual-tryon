import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

// Create a new Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const imageBuffer = await imageFile.arrayBuffer()

    const result = await Hf.imageClassification({
      model: "google/vit-base-patch16-224",
      data: new Uint8Array(imageBuffer),
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in image classification:", error)
    return NextResponse.json({ error: "Failed to classify image" }, { status: 500 })
  }
}
