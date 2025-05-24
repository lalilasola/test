import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

// Static metadata for the frame - this ensures meta tags are always present
export const metadata: Metadata = {
  title: "$BISOU - Farcaster Mini App",
  description: "Purchase $BISOU tokens on Base network",
  openGraph: {
    title: "$BISOU - Farcaster Mini App",
    description: "Purchase $BISOU tokens on Base network",
    images: ["https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474"],
  },
  other: {
    // Farcaster Frame Meta Tags - these will be in the HTML head
    "fc:frame": "vNext",
    "fc:frame:image": "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
    "fc:frame:image:aspect_ratio": "1.91:1",
    "fc:frame:button:1": "Open $BISOU Mini App",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
    "fc:frame:post_url": process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/frame`
      : "http://localhost:3000/api/frame",
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
        {/* Frame meta tags are automatically added by Next.js from the metadata object above */}
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
