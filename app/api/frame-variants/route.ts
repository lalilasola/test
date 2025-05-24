import { type NextRequest, NextResponse } from "next/server"

// Frame variants for A/B testing
const frameVariants = {
  original: {
    title: "$BISOU - Farcaster Mini App",
    description: "Purchase $BISOU tokens on Base network",
    buttonText: "Open Mini App",
    image: "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
    backgroundColor: "#8B5CF6",
    textColor: "#FFFFFF",
  },
  urgent: {
    title: "🔥 $BISOU - Limited Time!",
    description: "Get $BISOU tokens NOW on Base - Don't miss out!",
    buttonText: "Buy $BISOU Now! 🚀",
    image: "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
    backgroundColor: "#DC2626",
    textColor: "#FFFFFF",
  },
  minimal: {
    title: "$BISOU Token",
    description: "Trade on Base",
    buttonText: "Trade",
    image: "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
    backgroundColor: "#000000",
    textColor: "#FFFFFF",
  },
  community: {
    title: "💋 Join the $BISOU Community",
    description: "Be part of the sweetest token on Base network",
    buttonText: "Join Community 💕",
    image: "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
    backgroundColor: "#EC4899",
    textColor: "#FFFFFF",
  },
  professional: {
    title: "$BISOU - Base Network Token",
    description: "Professional DeFi trading on Base blockchain",
    buttonText: "Start Trading",
    image: "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
    backgroundColor: "#1F2937",
    textColor: "#F9FAFB",
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const variant = searchParams.get("variant") || "original"
  const fid = searchParams.get("fid") || "default"

  // Simple A/B testing logic - you can make this more sophisticated
  let selectedVariant = variant
  if (variant === "auto") {
    const variants = Object.keys(frameVariants)
    const hash = fid.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    selectedVariant = variants[Math.abs(hash) % variants.length]
  }

  const config = frameVariants[selectedVariant as keyof typeof frameVariants] || frameVariants.original
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  // Log the variant for analytics (you can send this to your analytics service)
  console.log(`Frame variant served: ${selectedVariant} for FID: ${fid}`)

  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/frame-image?variant=${selectedVariant}" />
        <meta property="fc:frame:button:1" content="${config.buttonText}" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}?variant=${selectedVariant}" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame-variants?variant=${selectedVariant}" />
        
        <meta property="og:title" content="${config.title}" />
        <meta property="og:description" content="${config.description}" />
        <meta property="og:image" content="${baseUrl}/api/frame-image?variant=${selectedVariant}" />
        
        <title>${config.title}</title>
      </head>
      <body>
        <h1>${config.title}</h1>
        <p>${config.description}</p>
      </body>
    </html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    },
  )
}
