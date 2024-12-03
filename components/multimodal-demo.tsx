"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageToText from "./multimodal/image-to-text"

export default function MultimodalDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multimodal Tasks</CardTitle>
        <CardDescription>Explore multimodal AI tasks that combine different types of data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="image-to-text">
          <TabsList className="grid grid-cols-1 mb-4">
            <TabsTrigger value="image-to-text">Image-to-Text</TabsTrigger>
          </TabsList>

          <TabsContent value="image-to-text">
            <ImageToText />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
