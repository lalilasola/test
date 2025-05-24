"use client"

import { useState } from "react"

export default function FrameTestPage() {
  const [frameUrl, setFrameUrl] = useState("")
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  const testUrls = [
    { name: "Production", url: baseUrl },
    { name: "Localhost", url: "http://localhost:3000" },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">$BISOU Frame Testing</h1>

        {/* URL Input */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Test Frame URL</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="url"
              value={frameUrl}
              onChange={(e) => setFrameUrl(e.target.value)}
              placeholder="Enter Frame URL to test"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={() => setFrameUrl(baseUrl)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Use Current
            </button>
          </div>

          {/* Quick Test URLs */}
          <div className="flex gap-2 mb-4">
            {testUrls.map((test) => (
              <button
                key={test.name}
                onClick={() => setFrameUrl(test.url)}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                {test.name}
              </button>
            ))}
          </div>
        </div>

        {/* Frame Preview */}
        {frameUrl && (
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Frame Preview</h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <iframe src={frameUrl} width="100%" height="600" className="border-0" title="Frame Preview" />
            </div>
          </div>
        )}

        {/* Testing Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">🔍 Validation Tools</h3>
            <div className="space-y-3">
              <a
                href="https://warpcast.com/~/developers/frames"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
              >
                <div className="font-medium">Warpcast Frame Validator</div>
                <div className="text-sm text-gray-600">Official Farcaster Frame testing tool</div>
              </a>
              <a
                href="https://debugger.framesjs.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
              >
                <div className="font-medium">Frame.js Debugger</div>
                <div className="text-sm text-gray-600">Interactive Frame debugging environment</div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">📱 Live Testing</h3>
            <div className="space-y-3">
              <a
                href="https://warpcast.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
              >
                <div className="font-medium">Test on Warpcast</div>
                <div className="text-sm text-gray-600">Share your Frame URL in a cast</div>
              </a>
              <div className="p-3 bg-yellow-50 rounded-md">
                <div className="font-medium">Mobile Testing</div>
                <div className="text-sm text-gray-600">Test on Warpcast mobile app for best results</div>
              </div>
            </div>
          </div>
        </div>

        {/* Frame Metadata Display */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">🏷️ Current Frame Metadata</h3>
          <div className="bg-gray-50 rounded-md p-4 font-mono text-sm overflow-x-auto">
            <div className="space-y-1">
              <div>
                <span className="text-blue-600">fc:frame:</span> vNext
              </div>
              <div>
                <span className="text-blue-600">fc:frame:image:</span>{" "}
                https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474
              </div>
              <div>
                <span className="text-blue-600">fc:frame:button:1:</span> Open Mini App
              </div>
              <div>
                <span className="text-blue-600">fc:frame:button:1:action:</span> link
              </div>
              <div>
                <span className="text-blue-600">fc:frame:button:1:target:</span> {baseUrl}
              </div>
            </div>
          </div>
        </div>

        {/* Testing Checklist */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">✅ Testing Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Frame image loads correctly</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Button text displays properly</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Mini App opens when clicked</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Wallet connection works</span>
              </label>
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Purchase buttons functional</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Custom amount input works</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Transaction flow completes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Mobile responsive design</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
