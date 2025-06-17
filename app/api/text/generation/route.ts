import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

// Create a new Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  try {
    const { prompt, max_length, temperature, model } = await req.json()

    const result = await Hf.textGeneration({
      model: model,
      inputs: prompt,
      parameters: {
        max_new_tokens: max_length,
        temperature: temperature,
        return_full_text: false,
      },
    })

    return NextResponse.json({ generated_text: result.generated_text })
  } catch (error) {
    console.error("Error in text generation:", error)
    return NextResponse.json({ error: "Failed to generate text" }, { status: 500 })
  }
}
