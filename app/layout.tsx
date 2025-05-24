import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

// Use the exact Vercel URL from the screenshot
const baseUrl = "https://v0-farcaster-mini-clenmcbwx-lalilasolas-projects.vercel.app"

// Create the FrameEmbed object according to the official spec
const createFrameEmbed = () => {
  const frameEmbed = {
    version: "next",
    imageUrl: "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
    button: {
      title: "Open $BISOU Mini App",
      action: {
        type: "launch_frame",
        name: "bisou-mini-app",
        url: `${baseUrl}/frame-launch`,
        splashImageUrl: "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
        splashBackgroundColor: "#8B5CF6",
      },
    },
  }

  return JSON.stringify(frameEmbed)
}

// Static metadata for the frame
export const metadata: Metadata = {
  title: "$BISOU - Farcaster Mini App",
  description: "Purchase $BISOU tokens on Base network",
  openGraph: {
    title: "$BISOU - Farcaster Mini App",
    description: "Purchase $BISOU tokens on Base network",
    images: ["https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474"],
  },
  other: {
    // Official Farcaster Frame Embed meta tag with stringified JSON
    "fc:frame": createFrameEmbed(),
    // Add manifest reference
    "fc:frame:manifest": `${baseUrl}/api/manifest`,
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <meta httpEquiv="Content-Security-Policy" content="frame-ancestors *;" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
