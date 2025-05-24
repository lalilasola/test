"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Copy, BarChart3, Users } from "lucide-react"

const variants = [
  {
    id: "original",
    name: "Original",
    description: "Clean, modern design with purple gradient",
    icon: "💋",
    color: "bg-purple-500",
    target: "General audience",
    hypothesis: "Balanced approach appeals to broad user base",
  },
  {
    id: "urgent",
    name: "Urgent/FOMO",
    description: "High-energy design with urgency indicators",
    icon: "🔥",
    color: "bg-red-500",
    target: "Action-oriented users",
    hypothesis: "Urgency drives higher conversion rates",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, simple design with minimal text",
    icon: "⚫",
    color: "bg-gray-900",
    target: "Design-conscious users",
    hypothesis: "Simplicity reduces cognitive load",
  },
  {
    id: "community",
    name: "Community",
    description: "Friendly, welcoming community-focused design",
    icon: "💕",
    color: "bg-pink-500",
    target: "Community builders",
    hypothesis: "Community angle increases engagement",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Serious, business-like DeFi trading focus",
    icon: "📈",
    color: "bg-gray-700",
    target: "Serious traders",
    hypothesis: "Professional look builds trust",
  },
]

export default function TestVariantsPage() {
  const [selectedVariant, setSelectedVariant] = useState("original")
  const [copiedUrl, setCopiedUrl] = useState("")

  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  const copyToClipboard = (url: string, variant: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(variant)
    setTimeout(() => setCopiedUrl(""), 2000)
  }

  const getTestUrl = (variant: string) => `${baseUrl}/api/frame-variants?variant=${variant}`
  const getImageUrl = (variant: string) => `${baseUrl}/api/frame-image?variant=${variant}`

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">$BISOU Frame A/B Testing</h1>
          <p className="text-gray-600">Test different frame designs and copy to optimize conversion rates</p>
        </div>

        {/* Testing Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Quick Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Test all variants quickly</p>
              <Button
                onClick={() => window.open("https://warpcast.com/~/developers/frames", "_blank")}
                className="w-full"
              >
                Open Frame Validator
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Auto A/B Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Automatic variant selection by user</p>
              <Button
                onClick={() => copyToClipboard(`${baseUrl}/api/frame-variants?variant=auto`, "auto")}
                variant="outline"
                className="w-full"
              >
                {copiedUrl === "auto" ? "Copied!" : "Copy Auto URL"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Live Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Test in real Farcaster environment</p>
              <Button
                onClick={() => window.open("https://warpcast.com/", "_blank")}
                variant="outline"
                className="w-full"
              >
                Open Warpcast
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Variant Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {variants.map((variant) => (
            <Card key={variant.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{variant.icon}</span>
                    {variant.name}
                  </CardTitle>
                  <Badge className={variant.color}>{variant.id}</Badge>
                </div>
                <CardDescription>{variant.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Frame Preview */}
                <div className="aspect-[1.91/1] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(variant.id) || "/placeholder.svg"}
                    alt={`${variant.name} variant`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Variant Info */}
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Target:</span> {variant.target}
                  </div>
                  <div>
                    <span className="font-medium">Hypothesis:</span> {variant.hypothesis}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(getTestUrl(variant.id), variant.id)}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedUrl === variant.id ? "Copied!" : "Copy URL"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `https://warpcast.com/~/developers/frames?url=${encodeURIComponent(getTestUrl(variant.id))}`,
                        "_blank",
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testing Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Testing Instructions</CardTitle>
            <CardDescription>How to effectively test your frame variants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🔍 Manual Testing</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Copy a variant URL</li>
                  <li>Paste into Frame Validator</li>
                  <li>Check image renders correctly</li>
                  <li>Test button functionality</li>
                  <li>Verify Mini App opens</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-3">📊 A/B Testing</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Share different variants in separate casts</li>
                  <li>Track engagement metrics</li>
                  <li>Monitor click-through rates</li>
                  <li>Measure conversion to purchases</li>
                  <li>Analyze user feedback</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                <li>Test variants with different audiences</li>
                <li>Run tests for at least 24-48 hours</li>
                <li>Consider time of day and day of week</li>
                <li>Track both clicks and actual purchases</li>
                <li>Use the auto variant for random distribution</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Metrics to Track */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📈 Key Metrics to Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">CTR</div>
                <div className="text-sm text-gray-600">Click-through Rate</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">CVR</div>
                <div className="text-sm text-gray-600">Conversion Rate</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">Engagement</div>
                <div className="text-sm text-gray-600">Likes, Recasts, Replies</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">Revenue</div>
                <div className="text-sm text-gray-600">Actual Purchases</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
