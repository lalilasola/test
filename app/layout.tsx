import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

// Dynamic metadata generation for proper frame support
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  return {
    title: "$BISOU - Farcaster Mini App",
    description: "Purchase $BISOU tokens on Base network",
    openGraph: {
      title: "$BISOU - Farcaster Mini App",
      description: "Purchase $BISOU tokens on Base network",
      images: ["https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474"],
    },
    other: {
      // Farcaster Frame Meta Tags
      "fc:frame": "vNext",
      "fc:frame:image": "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
      "fc:frame:image:aspect_ratio": "1.91:1",
      "fc:frame:button:1": "Open $BISOU Mini App",
      "fc:frame:button:1:action": "link",
      "fc:frame:button:1:target": baseUrl,
      "fc:frame:post_url": `${baseUrl}/api/frame`,
    },
    generator: "v0.dev",
  }
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
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content="https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474"
        />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="Open $BISOU Mini App" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta
          property="fc:frame:button:1:target"
          content={process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
