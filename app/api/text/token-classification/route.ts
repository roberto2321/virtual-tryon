import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

// Create a new Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  try {
    const { text, task } = await req.json()

    const model =
      task === "ner"
        ? "dbmdz/bert-large-cased-finetuned-conll03-english"
        : "vblagoje/bert-english-uncased-finetuned-pos"

    const result = await Hf.tokenClassification({
      model: model,
      inputs: text,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in token classification:", error)
    return NextResponse.json({ error: "Failed to classify tokens" }, { status: 500 })
  }
}
