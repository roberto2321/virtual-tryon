"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TextClassification from "./text/text-classification"
import ZeroShotClassification from "./text/zero-shot-classification"
import TokenClassification from "./text/token-classification"
import QuestionAnswering from "./text/question-answering"
import Summarization from "./text/summarization"
import Translation from "./text/translation"
import TextGeneration from "./text/text-generation"
import FeatureExtraction from "./text/feature-extraction"
import SentenceSimilarity from "./text/sentence-similarity"

export default function TextDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Tasks</CardTitle>
        <CardDescription>Explore various text-based AI tasks powered by Hugging Face models</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text-classification">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 mb-4">
            <TabsTrigger value="text-classification">Classification</TabsTrigger>
            <TabsTrigger value="zero-shot">Zero-Shot</TabsTrigger>
            <TabsTrigger value="token-classification">Token</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
            <TabsTrigger value="summarization">Summarization</TabsTrigger>
            <TabsTrigger value="translation">Translation</TabsTrigger>
            <TabsTrigger value="text-generation">Text-to-Text</TabsTrigger>
            <TabsTrigger value="feature-extraction">Feature Extraction</TabsTrigger>
            <TabsTrigger value="sentence-similarity">Sentence Similarity</TabsTrigger>
          </TabsList>

          <TabsContent value="text-classification">
            <TextClassification />
          </TabsContent>

          <TabsContent value="zero-shot">
            <ZeroShotClassification />
          </TabsContent>

          <TabsContent value="token-classification">
            <TokenClassification />
          </TabsContent>

          <TabsContent value="qa">
            <QuestionAnswering />
          </TabsContent>

          <TabsContent value="summarization">
            <Summarization />
          </TabsContent>

          <TabsContent value="translation">
            <Translation />
          </TabsContent>

          <TabsContent value="text-generation">
            <TextGeneration />
          </TabsContent>

          <TabsContent value="feature-extraction">
            <FeatureExtraction />
          </TabsContent>

          <TabsContent value="sentence-similarity">
            <SentenceSimilarity />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
