import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

// Create a new Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    const result = await Hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in feature extraction:", error)
    return NextResponse.json({ error: "Failed to extract features" }, { status: 500 })
  }
}
