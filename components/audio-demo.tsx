"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AudioClassification from "./audio/audio-classification"
import TextToSpeech from "./audio/text-to-speech"

export default function AudioDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Tasks</CardTitle>
        <CardDescription>Explore audio-based AI tasks powered by Hugging Face models</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="audio-classification">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="audio-classification">Audio Classification</TabsTrigger>
            <TabsTrigger value="text-to-speech">Text-to-Speech</TabsTrigger>
          </TabsList>

          <TabsContent value="audio-classification">
            <AudioClassification />
          </TabsContent>

          <TabsContent value="text-to-speech">
            <TextToSpeech />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
