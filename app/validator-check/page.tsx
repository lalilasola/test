"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, ExternalLink, RefreshCw, AlertTriangle, Copy } from "lucide-react"

export default function ValidatorCheckPage() {
  const [isChecking, setIsChecking] = useState(false)
  const [validationStatus, setValidationStatus] = useState<"unknown" | "pass" | "fail" | "checking">("unknown")
  const [metaTagsFound, setMetaTagsFound] = useState<Record<string, string>>({})
  const [copiedUrl, setCopiedUrl] = useState(false)

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"

  const expectedMetaTags = {
    "fc:frame": "vNext",
    "fc:frame:image": "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
    "fc:frame:image:aspect_ratio": "1.91:1",
    "fc:frame:button:1": "Open $BISOU Mini App",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": baseUrl,
    "fc:frame:post_url": `${baseUrl}/api/frame`,
  }

  const checkFrameMetaTags = async () => {
    setIsChecking(true)
    setValidationStatus("checking")

    try {
      // Fetch the page HTML
      const response = await fetch(baseUrl)
      const html = await response.text()

      // Parse HTML to check for meta tags
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      const foundTags: Record<string, string> = {}
      let allTagsFound = true

      for (const [tagName, expectedValue] of Object.entries(expectedMetaTags)) {
        const metaTag = doc.querySelector(`meta[property="${tagName}"]`)
        const content = metaTag?.getAttribute("content") || ""

        foundTags[tagName] = content

        if (!content || (tagName !== "fc:frame:button:1:target" && content !== expectedValue)) {
          allTagsFound = false
        }
      }

      setMetaTagsFound(foundTags)
      setValidationStatus(allTagsFound ? "pass" : "fail")
    } catch (error) {
      console.error("Error checking meta tags:", error)
      setValidationStatus("fail")
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkFrameMetaTags()
  }, [])

  const copyUrl = () => {
    navigator.clipboard.writeText(baseUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const openWarpcastValidator = () => {
    window.open(`https://warpcast.com/~/developers/frames?url=${encodeURIComponent(baseUrl)}`, "_blank")
  }

  const openFramePlayground = () => {
    window.open("https://warpcast.com/~/developers/frames", "_blank")
  }

  const getStatusColor = () => {
    switch (validationStatus) {
      case "pass":
        return "text-green-600 bg-green-50 border-green-200"
      case "fail":
        return "text-red-600 bg-red-50 border-red-200"
      case "checking":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = () => {
    switch (validationStatus) {
      case "pass":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "fail":
        return <XCircle className="h-6 w-6 text-red-500" />
      case "checking":
        return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 Official Validator Check</h1>
          <p className="text-gray-600">Verify your frame works with the Warpcast Frame Validator</p>
        </div>

        {/* Status Card */}
        <Card className={`mb-8 border-2 ${getStatusColor()}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div>
                  <CardTitle className="text-xl">
                    {validationStatus === "pass" && "✅ Frame Ready for Validation!"}
                    {validationStatus === "fail" && "❌ Frame Issues Detected"}
                    {validationStatus === "checking" && "🔄 Checking Frame..."}
                    {validationStatus === "unknown" && "❓ Frame Status Unknown"}
                  </CardTitle>
                  <CardDescription>
                    {validationStatus === "pass" &&
                      "All meta tags found. Your frame should work with the official validator."}
                    {validationStatus === "fail" && "Some meta tags are missing or incorrect."}
                    {validationStatus === "checking" && "Analyzing frame meta tags..."}
                    {validationStatus === "unknown" && "Click 'Check Frame' to analyze your frame."}
                  </CardDescription>
                </div>
              </div>
              <Button onClick={checkFrameMetaTags} disabled={isChecking} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
                Check Frame
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Official Warpcast Validator
              </CardTitle>
              <CardDescription>Test with the official Farcaster Frame validator</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 p-2 bg-white rounded border text-sm font-mono break-all">{baseUrl}</div>
                  <Button size="sm" variant="outline" onClick={copyUrl}>
                    {copiedUrl ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button onClick={openWarpcastValidator} className="w-full bg-purple-600 hover:bg-purple-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Official Validator
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Frame Playground
              </CardTitle>
              <CardDescription>Test in the Farcaster Frame Playground</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-blue-700">
                  The Frame Playground should now detect your frame embed instead of showing "No frame embed found".
                </p>
                <Button onClick={openFramePlayground} className="w-full bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Frame Playground
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meta Tags Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🏷️ Frame Meta Tags Analysis</CardTitle>
            <CardDescription>Detailed analysis of your frame's meta tags</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(expectedMetaTags).map(([tagName, expectedValue]) => {
                const foundValue = metaTagsFound[tagName]
                const isCorrect = foundValue === expectedValue || (tagName === "fc:frame:button:1:target" && foundValue)
                const hasValue = !!foundValue

                return (
                  <div key={tagName} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3 flex-1">
                      {hasValue ? (
                        isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        )
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{tagName}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          <div>Expected: {expectedValue}</div>
                          <div>Found: {foundValue || "Not found"}</div>
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={
                        isCorrect && hasValue ? "bg-green-500" : hasValue ? "bg-yellow-500" : "bg-red-500 text-white"
                      }
                    >
                      {isCorrect && hasValue ? "✓ Correct" : hasValue ? "⚠ Warning" : "✗ Missing"}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Testing Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📋 Validation Testing Steps</CardTitle>
            <CardDescription>Follow these steps to test with the official validator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Badge className="bg-purple-600 text-white min-w-8 h-8 flex items-center justify-center">1</Badge>
                <div>
                  <div className="font-medium">Check Frame Meta Tags</div>
                  <div className="text-sm text-gray-600">
                    Ensure all meta tags above show "✓ Correct" status. If not, redeploy your app.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Badge className="bg-purple-600 text-white min-w-8 h-8 flex items-center justify-center">2</Badge>
                <div>
                  <div className="font-medium">Open Official Validator</div>
                  <div className="text-sm text-gray-600">
                    Click "Open Official Validator" above to test with the Warpcast Frame Validator.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Badge className="bg-purple-600 text-white min-w-8 h-8 flex items-center justify-center">3</Badge>
                <div>
                  <div className="font-medium">Paste Your URL</div>
                  <div className="text-sm text-gray-600">
                    The URL should be automatically filled, or copy it from above and paste it in the validator.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Badge className="bg-purple-600 text-white min-w-8 h-8 flex items-center justify-center">4</Badge>
                <div>
                  <div className="font-medium">Verify Results</div>
                  <div className="text-sm text-gray-600">
                    You should see the BISOU heart logo and "Open $BISOU Mini App" button. All diagnostics should be
                    green.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Badge className="bg-purple-600 text-white min-w-8 h-8 flex items-center justify-center">5</Badge>
                <div>
                  <div className="font-medium">Test Button Interaction</div>
                  <div className="text-sm text-gray-600">
                    Click the frame button to ensure it properly opens your Mini App.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expected Results */}
        <Card>
          <CardHeader>
            <CardTitle>✅ Expected Validator Results</CardTitle>
            <CardDescription>What you should see in the official validator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-700">✅ Success Indicators:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">BISOU heart logo displays clearly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Button shows "Open $BISOU Mini App"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Frame dimensions are 1.91:1 aspect ratio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">All diagnostics show green checkmarks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">No "duplicate meta tag" errors</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-blue-700">🎯 Frame Playground:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Shows frame preview instead of "No frame embed found"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Launch button works correctly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Preview shows proper frame layout</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
