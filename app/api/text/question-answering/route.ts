import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

// Create a new Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  try {
    const { context, question } = await req.json()

    const result = await Hf.questionAnswering({
      model: "deepset/roberta-base-squad2",
      inputs: {
        question: question,
        context: context,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in question answering:", error)
    return NextResponse.json({ error: "Failed to answer question" }, { status: 500 })
  }
}
