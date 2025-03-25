import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { text, apiKey } = await req.json()

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
      const result = await Hf.textClassification({
        model: "cardiffnlp/twitter-roberta-base-sentiment",
        inputs: text,
      })

      return NextResponse.json(Array.isArray(result) ? result : [result])
    } catch (apiError: any) {
      console.error("Hugging Face API error:", apiError.message || apiError)

      // Check for quota exceeded error
      if (apiError.message && apiError.message.includes("exceeded your monthly included credits")) {
        return NextResponse.json(
          {
            error: "quota_exceeded",
            message: "Monthly Hugging Face API credits exceeded. Please upgrade to Pro or use your own API key.",
            details: "You can upgrade at https://huggingface.co/pricing or configure your own API key in settings.",
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
            message: "The model is not available through the Inference API.",
          },
          { status: 400 },
        )
      }

      // Generic error
      return NextResponse.json(
        {
          error: "api_error",
          message: "Failed to classify text. Please try again later.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in text classification:", error)
    return NextResponse.json(
      {
        error: "request_error",
        message: "Invalid request format",
      },
      { status: 400 },
    )
  }
}
