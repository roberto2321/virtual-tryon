"use client"

import { useState, useEffect } from "react"

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string>("")

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem("huggingface_api_key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  const updateApiKey = (newApiKey: string) => {
    setApiKey(newApiKey)
    if (newApiKey) {
      localStorage.setItem("huggingface_api_key", newApiKey)
    } else {
      localStorage.removeItem("huggingface_api_key")
    }
  }

  const getApiKey = () => {
    return localStorage.getItem("huggingface_api_key") || ""
  }

  return {
    apiKey,
    updateApiKey,
    getApiKey,
  }
}
