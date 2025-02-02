import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

// Create a new Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  try {
    const { text, max_length, min_length } = await req.json()

    const result = await Hf.summarization({
      model: "facebook/bart-large-cnn",
      inputs: text,
      parameters: {
        max_length: max_length,
        min_length: min_length,
      },
    })

    return NextResponse.json({ summary: result.summary_text })
  } catch (error) {
    console.error("Error in summarization:", error)
    return NextResponse.json({ error: "Failed to summarize text" }, { status: 500 })
  }
}
