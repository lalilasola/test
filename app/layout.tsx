import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "$BISOU - Farcaster Mini App",
  description: "Purchase $BISOU tokens on Base network",
  other: {
    // Default to original variant - can be overridden by variant routes
    "fc:frame": "vNext",
    "fc:frame:image": "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
    "fc:frame:button:1": "Open Mini App",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
  },
  openGraph: {
    title: "$BISOU - Farcaster Mini App",
    description: "Purchase $BISOU tokens on Base network",
    images: ["https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474"],
  },
    generator: 'v0.dev'
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
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
