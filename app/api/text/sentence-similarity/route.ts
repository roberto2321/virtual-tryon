import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

// Create a new Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  try {
    const { sentence1, sentence2 } = await req.json()

    // First, get embeddings for both sentences
    const embedding1 = await Hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: sentence1,
    })

    const embedding2 = await Hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: sentence2,
    })

    // Calculate cosine similarity
    const similarity = calculateCosineSimilarity(embedding1, embedding2)

    return NextResponse.json({ similarity })
  } catch (error) {
    console.error("Error in sentence similarity:", error)
    return NextResponse.json({ error: "Failed to calculate similarity" }, { status: 500 })
  }
}

// Function to calculate cosine similarity between two vectors
function calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error("Vectors must have the same length")
  }

  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i]
    norm1 += vec1[i] * vec1[i]
    norm2 += vec2[i] * vec2[i]
  }

  norm1 = Math.sqrt(norm1)
  norm2 = Math.sqrt(norm2)

  if (norm1 === 0 || norm2 === 0) {
    return 0
  }

  return dotProduct / (norm1 * norm2)
}
