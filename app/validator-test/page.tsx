"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Copy, CheckCircle, AlertCircle } from "lucide-react"

export default function ValidatorTestPage() {
  const [copiedUrl, setCopiedUrl] = useState("")
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(id)
    setTimeout(() => setCopiedUrl(""), 2000)
  }

  const openValidator = (url: string) => {
    window.open(`https://warpcast.com/~/developers/frames?url=${encodeURIComponent(url)}`, "_blank")
  }

  const testUrls = [
    {
      id: "main",
      name: "Main Frame URL",
      url: baseUrl,
      description: "Primary frame endpoint",
    },
    {
      id: "api",
      name: "Frame API Endpoint",
      url: `${baseUrl}/api/frame`,
      description: "Frame API for interactions",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 Warpcast Frame Validator</h1>
          <p className="text-gray-600">Test your $BISOU frame with the official Warpcast validator</p>
        </div>

        {/* Quick Validator Access */}
        <Card className="mb-8 border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <ExternalLink className="h-5 w-5" />
              Official Warpcast Frame Validator
            </CardTitle>
            <CardDescription>Test your frame with the official Farcaster validation tool</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input value={baseUrl} readOnly className="flex-1 bg-white" />
                <Button onClick={() => copyToClipboard(baseUrl, "validator-url")} variant="outline">
                  {copiedUrl === "validator-url" ? "Copied!" : <Copy className="h-4 w-4" />}
                </Button>
                <Button onClick={() => openValidator(baseUrl)} className="bg-purple-600 hover:bg-purple-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Validator
                </Button>
              </div>
              <p className="text-sm text-purple-700">
                Click "Open Validator" to test your frame, or copy the URL and paste it manually.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test URLs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🔗 Frame URLs to Test</CardTitle>
            <CardDescription>Test these URLs in the Warpcast Frame Validator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testUrls.map((testUrl) => (
                <div key={testUrl.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{testUrl.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{testUrl.description}</div>
                    <div className="text-xs font-mono text-gray-500 break-all">{testUrl.url}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(testUrl.url, testUrl.id)}>
                      {copiedUrl === testUrl.id ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => openValidator(testUrl.url)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Test
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expected Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>✅ Expected Validation Results</CardTitle>
            <CardDescription>What you should see in the Warpcast Frame Validator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-700">✅ Should Pass:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Frame image loads (BISOU heart logo)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Button text: "Open $BISOU Mini App"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Aspect ratio: 1.91:1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Frame version: vNext</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">No duplicate meta tags</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-red-700">❌ Common Issues:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Image fails to load</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Missing meta tags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Duplicate meta tags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Wrong aspect ratio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Button not working</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step by Step Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📋 Step-by-Step Validation</CardTitle>
            <CardDescription>Follow these steps to validate your frame</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Badge className="bg-purple-600 text-white min-w-8 h-8 flex items-center justify-center">1</Badge>
                <div>
                  <div className="font-medium">Open Warpcast Frame Validator</div>
                  <div className="text-sm text-gray-600">
                    Click the "Open Validator" button above or visit{" "}
                    <a
                      href="https://warpcast.com/~/developers/frames"
                      target="_blank"
                      className="text-purple-600 underline"
                      rel="noreferrer"
                    >
                      warpcast.com/~/developers/frames
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Badge className="bg-purple-600 text-white min-w-8 h-8 flex items-center justify-center">2</Badge>
                <div>
                  <div className="font-medium">Paste Your Frame URL</div>
                  <div className="text-sm text-gray-600">
                    Copy your frame URL from above and paste it into the validator input field
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Badge className="bg-purple-600 text-white min-w-8 h-8 flex items-center justify-center">3</Badge>
                <div>
                  <div className="font-medium">Click "Load Frame"</div>
                  <div className="text-sm text-gray-600">
                    Press Enter or click the load button to validate your frame
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Badge className="bg-purple-600 text-white min-w-8 h-8 flex items-center justify-center">4</Badge>
                <div>
                  <div className="font-medium">Check Results</div>
                  <div className="text-sm text-gray-600">
                    Verify that the BISOU heart logo appears and the button works correctly
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Badge className="bg-purple-600 text-white min-w-8 h-8 flex items-center justify-center">5</Badge>
                <div>
                  <div className="font-medium">Test Button Interaction</div>
                  <div className="text-sm text-gray-600">
                    Click the "Open $BISOU Mini App" button to ensure it opens your app correctly
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Validators */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Alternative Validation Tools</CardTitle>
            <CardDescription>Additional tools to test your frame</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  window.open(`https://debugger.framesjs.org/?url=${encodeURIComponent(baseUrl)}`, "_blank")
                }
                className="h-auto p-4 flex flex-col items-start"
              >
                <div className="font-medium">Frame.js Debugger</div>
                <div className="text-sm text-gray-600">Interactive frame debugging tool</div>
              </Button>

              <Button
                variant="outline"
                onClick={() => window.open("/validate-frame", "_blank")}
                className="h-auto p-4 flex flex-col items-start"
              >
                <div className="font-medium">Internal Validator</div>
                <div className="text-sm text-gray-600">Our comprehensive validation tool</div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
