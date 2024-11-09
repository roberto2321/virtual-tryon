"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Eye, EyeOff, Key } from "lucide-react"

interface ApiKeySettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apiKey: string
  onApiKeyChange: (apiKey: string) => void
}

export default function ApiKeySettings({ open, onOpenChange, apiKey, onApiKeyChange }: ApiKeySettingsProps) {
  const [tempApiKey, setTempApiKey] = useState(apiKey)
  const [showApiKey, setShowApiKey] = useState(false)

  const handleSave = () => {
    onApiKeyChange(tempApiKey)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTempApiKey(apiKey)
    onOpenChange(false)
  }

  const handleClear = () => {
    setTempApiKey("")
    onApiKeyChange("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Hugging Face API Settings
          </DialogTitle>
          <DialogDescription>
            Configure your Hugging Face API key to use your own quota and access additional models.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Using your own API key allows you to:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Bypass quota limitations</li>
                <li>Access premium models</li>
                <li>Get faster response times</li>
                <li>Use your own billing account</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://huggingface.co/settings/tokens", "_blank")}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Get API Key
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open("https://huggingface.co/pricing", "_blank")}>
              <ExternalLink className="h-3 w-3 mr-1" />
              View Pricing
            </Button>
          </div>

          {apiKey && (
            <Alert>
              <AlertDescription>
                ✅ API key is configured. The application will use your personal Hugging Face account for API calls.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {apiKey && (
            <Button variant="destructive" onClick={handleClear}>
              Clear Key
            </Button>
          )}
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
