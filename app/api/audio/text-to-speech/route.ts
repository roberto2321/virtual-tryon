import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

// Create a new Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  try {
    const { text, model } = await req.json()

    const result = await Hf.textToSpeech({
      model: model,
      inputs: text,
    })

    // Return the audio directly
    return new Response(result, {
      headers: {
        "Content-Type": "audio/wav",
      },
    })
  } catch (error) {
    console.error("Error in text-to-speech:", error)
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 })
  }
}
