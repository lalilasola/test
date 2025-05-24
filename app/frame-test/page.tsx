"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, ExternalLink, Copy } from "lucide-react"

export default function FrameTestPage() {
  const [testResults, setTestResults] = useState<Record<string, boolean | null>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState("")

  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  const tests = [
    {
      id: "frame-endpoint",
      name: "Frame Endpoint",
      description: "Check if /api/frame endpoint responds correctly",
      url: `${baseUrl}/api/frame`,
    },
    {
      id: "main-page",
      name: "Main Page",
      description: "Check if main page loads with proper meta tags",
      url: baseUrl,
    },
    {
      id: "image-loads",
      name: "IPFS Image",
      description: "Check if BISOU logo loads from IPFS",
      url: "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
    },
  ]

  const runTest = async (test: (typeof tests)[0]) => {
    setTestResults((prev) => ({ ...prev, [test.id]: null }))

    try {
      const response = await fetch(test.url, { method: "GET" })
      const success = response.ok
      setTestResults((prev) => ({ ...prev, [test.id]: success }))
      return success
    } catch (error) {
      console.error(`Test ${test.id} failed:`, error)
      setTestResults((prev) => ({ ...prev, [test.id]: false }))
      return false
    }
  }

  const runAllTests = async () => {
    setIsLoading(true)
    for (const test of tests) {
      await runTest(test)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Small delay between tests
    }
    setIsLoading(false)
  }

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(id)
    setTimeout(() => setCopiedUrl(""), 2000)
  }

  const getStatusIcon = (testId: string) => {
    const result = testResults[testId]
    if (result === null) return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
    if (result === true) return <CheckCircle className="h-4 w-4 text-green-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = (testId: string) => {
    const result = testResults[testId]
    if (result === null) return <Badge variant="secondary">Pending</Badge>
    if (result === true) return <Badge className="bg-green-500">Pass</Badge>
    return <Badge variant="destructive">Fail</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">$BISOU Frame Testing</h1>
          <p className="text-gray-600">Test your Farcaster Frame functionality and deployment</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">🚀 Run Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={runAllTests} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Run All Tests"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">🔍 Validate Frame</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(`https://warpcast.com/~/developers/frames?url=${encodeURIComponent(baseUrl)}`, "_blank")
                }
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Validator
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">📱 Test Live</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => window.open("https://warpcast.com/", "_blank")}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Warpcast
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🧪 Test Results</CardTitle>
            <CardDescription>Automated tests for your Frame functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.id)}
                    <div>
                      <div className="font-medium">{test.name}</div>
                      <div className="text-sm text-gray-600">{test.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(test.id)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => runTest(test)}
                      disabled={testResults[test.id] === null}
                    >
                      Test
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* URLs for Testing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🔗 Testing URLs</CardTitle>
            <CardDescription>Copy these URLs for manual testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Main Frame URL</div>
                  <div className="text-sm text-gray-600 font-mono">{baseUrl}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(baseUrl, "main")}>
                  {copiedUrl === "main" ? "Copied!" : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Frame API Endpoint</div>
                  <div className="text-sm text-gray-600 font-mono">{baseUrl}/api/frame</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(`${baseUrl}/api/frame`, "api")}>
                  {copiedUrl === "api" ? "Copied!" : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Frame Preview */}
        <Card>
          <CardHeader>
            <CardTitle>👀 Frame Preview</CardTitle>
            <CardDescription>How your frame appears in Farcaster</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-white">
              <div className="p-4 border-b bg-gray-50">
                <div className="text-sm font-medium text-gray-600">Farcaster Frame Preview</div>
              </div>
              <div className="aspect-[1.91/1] bg-gray-100 flex items-center justify-center">
                <img
                  src="https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474"
                  alt="BISOU Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-4 border-t">
                <div className="flex justify-center">
                  <div className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium">Open $BISOU Mini App</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📋 Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Automated Testing</h4>
                <p className="text-sm text-gray-600">
                  Click "Run All Tests" to check if your endpoints are working correctly.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Frame Validation</h4>
                <p className="text-sm text-gray-600">
                  Use the Warpcast Frame Validator to test how your frame renders.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Live Testing</h4>
                <p className="text-sm text-gray-600">
                  Share your frame URL in a Warpcast cast to test in the real environment.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. Mini App Testing</h4>
                <p className="text-sm text-gray-600">
                  Click the frame button to test the Mini App functionality and wallet connection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
