import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474" />
        <meta property="fc:frame:button:1" content="Open $BISOU Mini App" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
        
        <meta property="og:title" content="$BISOU - Farcaster Mini App" />
        <meta property="og:description" content="Purchase $BISOU tokens on Base network" />
        <meta property="og:image" content="https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474" />
        
        <title>$BISOU - Farcaster Mini App</title>
      </head>
      <body>
        <h1>$BISOU Mini App</h1>
        <p>Purchase $BISOU tokens on Base network</p>
        <img src="https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474" alt="BISOU Logo" style="max-width: 400px;" />
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

export async function POST(request: NextRequest) {
  // Handle frame interactions
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474" />
        <meta property="fc:frame:button:1" content="Open $BISOU Mini App" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}" />
        
        <title>$BISOU - Farcaster Mini App</title>
      </head>
      <body>
        <h1>$BISOU Mini App</h1>
        <p>Click to open the Mini App and purchase $BISOU tokens!</p>
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
