import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

// Create a new Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 })
    }

    const audioBuffer = await audioFile.arrayBuffer()

    const result = await Hf.audioClassification({
      model: "superb/hubert-large-superb-er",
      data: new Uint8Array(audioBuffer),
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in audio classification:", error)
    return NextResponse.json({ error: "Failed to classify audio" }, { status: 500 })
  }
}
