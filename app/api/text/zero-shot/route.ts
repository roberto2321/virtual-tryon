import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { text, labels, apiKey } = await req.json()

    // Use the provided API key or fall back to the environment variable
    const hfApiKey = apiKey || process.env.HUGGINGFACE_API_KEY

    if (!hfApiKey) {
      return NextResponse.json(
        { error: "No API key provided. Please configure your Hugging Face API key." },
        { status: 401 },
      )
    }

    const Hf = new HfInference(hfApiKey)

    try {
      // Use the generic request method instead of the typed zeroShotClassification method
      const result = await Hf.request({
        model: "facebook/bart-large-mnli",
        inputs: text,
        parameters: {
          candidate_labels: labels.join(","),
        },
        task: "zero-shot-classification",
      })

      // Format the response to match what the frontend expects
      return NextResponse.json({
        labels: Array.isArray(result.labels) ? result.labels : [result.labels],
        scores: Array.isArray(result.scores) ? result.scores : [result.scores],
        sequence: result.sequence || text,
      })
    } catch (apiError: any) {
      console.error("Hugging Face API error:", apiError.message || apiError)

      // Check for quota exceeded error
      if (apiError.message && apiError.message.includes("exceeded your monthly included credits")) {
        return NextResponse.json(
          {
            error: "quota_exceeded",
            message: "Monthly Hugging Face API credits exceeded. Please upgrade to Pro or use your own API key.",
          },
          { status: 429 },
        )
      }

      // Check for invalid API key
      if (
        apiError.message &&
        (apiError.message.includes("Invalid token") || apiError.message.includes("unauthorized"))
      ) {
        return NextResponse.json(
          {
            error: "invalid_api_key",
            message: "Invalid API key. Please check your Hugging Face API key.",
          },
          { status: 401 },
        )
      }

      // Check if it's a model availability issue
      if (apiError.message && apiError.message.includes("not been able to find inference provider")) {
        return NextResponse.json(
          {
            error: "model_unavailable",
            message: "The model is not available through the Inference API. Try a different model.",
          },
          { status: 400 },
        )
      }

      // Generic error
      return NextResponse.json(
        {
          error: "api_error",
          message: "Failed to classify text. Please try again later.",
          details: apiError.message || "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in zero-shot classification:", error)
    return NextResponse.json(
      {
        error: "request_error",
        message: "Invalid request format",
      },
      { status: 400 },
    )
  }
}
