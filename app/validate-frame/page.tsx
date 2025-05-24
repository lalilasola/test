"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, ExternalLink, RefreshCw, AlertTriangle } from "lucide-react"

interface ValidationResult {
  name: string
  status: "pass" | "fail" | "warning" | "loading"
  value?: string
  expected?: string
  description: string
}

export default function ValidateFramePage() {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [overallStatus, setOverallStatus] = useState<"pass" | "fail" | "warning" | "loading">("loading")

  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  const expectedValidations: Omit<ValidationResult, "status" | "value">[] = [
    {
      name: "fc:frame",
      expected: "vNext",
      description: "Frame version specification",
    },
    {
      name: "fc:frame:image",
      expected: "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
      description: "Frame image URL",
    },
    {
      name: "fc:frame:image:aspect_ratio",
      expected: "1.91:1",
      description: "Frame image aspect ratio",
    },
    {
      name: "fc:frame:button:1",
      expected: "Open $BISOU Mini App",
      description: "Frame button text",
    },
    {
      name: "fc:frame:button:1:action",
      expected: "link",
      description: "Frame button action type",
    },
    {
      name: "fc:frame:button:1:target",
      expected: baseUrl,
      description: "Frame button target URL",
    },
    {
      name: "fc:frame:post_url",
      expected: `${baseUrl}/api/frame`,
      description: "Frame POST endpoint",
    },
    {
      name: "og:title",
      expected: "$BISOU - Farcaster Mini App",
      description: "Open Graph title",
    },
    {
      name: "og:description",
      expected: "Purchase $BISOU tokens on Base network",
      description: "Open Graph description",
    },
    {
      name: "og:image",
      expected: "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
      description: "Open Graph image",
    },
  ]

  const validateFrame = async () => {
    setIsValidating(true)
    const results: ValidationResult[] = []

    try {
      // Fetch the main page HTML
      const response = await fetch(baseUrl)
      const html = await response.text()

      // Parse HTML to extract meta tags
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      for (const validation of expectedValidations) {
        const metaTag = doc.querySelector(`meta[property="${validation.name}"], meta[name="${validation.name}"]`)
        const content = metaTag?.getAttribute("content") || ""

        let status: "pass" | "fail" | "warning" = "fail"

        if (content) {
          if (content === validation.expected) {
            status = "pass"
          } else if (content.includes(validation.expected || "")) {
            status = "warning"
          }
        }

        results.push({
          ...validation,
          status,
          value: content || "Not found",
        })
      }

      // Additional checks
      const additionalChecks = [
        {
          name: "Image Accessibility",
          description: "IPFS image loads successfully",
          check: async () => {
            try {
              const imgResponse = await fetch(
                "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
                { method: "HEAD" },
              )
              return imgResponse.ok ? "pass" : "fail"
            } catch {
              return "fail"
            }
          },
        },
        {
          name: "Frame API Endpoint",
          description: "Frame API responds correctly",
          check: async () => {
            try {
              const apiResponse = await fetch(`${baseUrl}/api/frame`)
              return apiResponse.ok ? "pass" : "fail"
            } catch {
              return "fail"
            }
          },
        },
        {
          name: "No Duplicate Meta Tags",
          description: "Each meta tag appears only once",
          check: async () => {
            const metaTags = Array.from(doc.querySelectorAll("meta[property^='fc:frame']"))
            const tagCounts = new Map()

            metaTags.forEach((tag) => {
              const property = tag.getAttribute("property")
              tagCounts.set(property, (tagCounts.get(property) || 0) + 1)
            })

            const hasDuplicates = Array.from(tagCounts.values()).some((count) => count > 1)
            return hasDuplicates ? "fail" : "pass"
          },
        },
      ]

      for (const check of additionalChecks) {
        const status = await check.check()
        results.push({
          name: check.name,
          description: check.description,
          status,
          value: status === "pass" ? "✓ OK" : "✗ Failed",
        })
      }

      setValidationResults(results)

      // Calculate overall status
      const hasFailures = results.some((r) => r.status === "fail")
      const hasWarnings = results.some((r) => r.status === "warning")

      if (hasFailures) {
        setOverallStatus("fail")
      } else if (hasWarnings) {
        setOverallStatus("warning")
      } else {
        setOverallStatus("pass")
      }
    } catch (error) {
      console.error("Validation error:", error)
      setOverallStatus("fail")
    } finally {
      setIsValidating(false)
    }
  }

  useEffect(() => {
    validateFrame()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return <Badge className="bg-green-500">Pass</Badge>
      case "fail":
        return <Badge variant="destructive">Fail</Badge>
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>
      case "loading":
        return <Badge variant="secondary">Loading</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case "pass":
        return "text-green-600 bg-green-50 border-green-200"
      case "fail":
        return "text-red-600 bg-red-50 border-red-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const passCount = validationResults.filter((r) => r.status === "pass").length
  const totalCount = validationResults.length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">$BISOU Frame Validation</h1>
          <p className="text-gray-600">Comprehensive validation of your Farcaster Frame</p>
        </div>

        {/* Overall Status */}
        <Card className={`mb-8 border-2 ${getOverallStatusColor()}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(overallStatus)}
                <div>
                  <CardTitle className="text-xl">
                    {overallStatus === "pass" && "✅ Frame Validation Passed!"}
                    {overallStatus === "fail" && "❌ Frame Validation Failed"}
                    {overallStatus === "warning" && "⚠️ Frame Validation Has Warnings"}
                    {overallStatus === "loading" && "🔄 Validating Frame..."}
                  </CardTitle>
                  <CardDescription>
                    {passCount}/{totalCount} checks passed
                  </CardDescription>
                </div>
              </div>
              <Button onClick={validateFrame} disabled={isValidating} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${isValidating ? "animate-spin" : ""}`} />
                Re-validate
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">🔍 Warpcast Validator</CardTitle>
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
                Open Official Validator
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">🧪 Frame Debugger</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(`https://debugger.framesjs.org/?url=${encodeURIComponent(baseUrl)}`, "_blank")
                }
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Debugger
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
                Test in Warpcast
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Validation Results */}
        <Card>
          <CardHeader>
            <CardTitle>🧪 Detailed Validation Results</CardTitle>
            <CardDescription>Individual checks for frame compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {validationResults.map((result, index) => (
                <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-gray-600 mb-2">{result.description}</div>
                      {result.expected && (
                        <div className="text-xs">
                          <div className="text-gray-500">Expected: {result.expected}</div>
                          <div className="text-gray-700">Found: {result.value}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">{getStatusBadge(result.status)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Frame Preview */}
        <Card className="mt-8">
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
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.parentElement!.innerHTML = "<div class='text-red-500'>Failed to load image</div>"
                  }}
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
      </div>
    </div>
  )
}
