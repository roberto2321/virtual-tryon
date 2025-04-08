"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageClassification from "./image/image-classification"
import TextToImage from "./image/text-to-image"

export default function ImageDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Tasks</CardTitle>
        <CardDescription>Explore image-based AI tasks powered by Hugging Face models</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="image-classification">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="image-classification">Image Classification</TabsTrigger>
            <TabsTrigger value="text-to-image">Text-to-Image</TabsTrigger>
          </TabsList>

          <TabsContent value="image-classification">
            <ImageClassification />
          </TabsContent>

          <TabsContent value="text-to-image">
            <TextToImage />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
