import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

// Create a new Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  try {
    const { text, target_language } = await req.json()

    // Map of language codes to model names
    const modelMap: Record<string, string> = {
      fr: "Helsinki-NLP/opus-mt-en-fr",
      es: "Helsinki-NLP/opus-mt-en-es",
      de: "Helsinki-NLP/opus-mt-en-de",
      it: "Helsinki-NLP/opus-mt-en-it",
      pt: "Helsinki-NLP/opus-mt-en-pt",
      ru: "Helsinki-NLP/opus-mt-en-ru",
      zh: "Helsinki-NLP/opus-mt-en-zh",
      ja: "Helsinki-NLP/opus-mt-en-jap",
      ar: "Helsinki-NLP/opus-mt-en-ar",
      hi: "Helsinki-NLP/opus-mt-en-hi",
    }

    const model = modelMap[target_language] || "Helsinki-NLP/opus-mt-en-fr"

    const result = await Hf.translation({
      model: model,
      inputs: text,
    })

    return NextResponse.json({ translation: result.translation_text })
  } catch (error) {
    console.error("Error in translation:", error)
    return NextResponse.json({ error: "Failed to translate text" }, { status: 500 })
  }
}
