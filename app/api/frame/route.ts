import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  // Create the FrameEmbed object according to the official spec
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

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>$BISOU - Farcaster Mini App</title>
    
    <!-- Official Farcaster Frame Embed Meta Tag -->
    <meta name="fc:frame" content='${JSON.stringify(frameEmbed)}' />
    <meta name="fc:frame:manifest" content="${baseUrl}/api/manifest" />
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="$BISOU - Farcaster Mini App" />
    <meta property="og:description" content="Purchase $BISOU tokens on Base network" />
    <meta property="og:image" content="https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474" />
    <meta property="og:url" content="${baseUrl}" />
    <meta property="og:type" content="website" />
    
    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="$BISOU - Farcaster Mini App" />
    <meta name="twitter:description" content="Purchase $BISOU tokens on Base network" />
    <meta name="twitter:image" content="https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474" />
    
    <!-- Manifest Link -->
    <link rel="manifest" href="${baseUrl}/api/manifest" />
  </head>
  <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
    <div style="text-align: center; max-width: 600px;">
      <h1 style="font-size: 3rem; margin-bottom: 1rem;">💋 $BISOU</h1>
      <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9;">The sweetest token on Base network</p>
      
      <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 20px; padding: 2rem; margin-bottom: 2rem;">
        <img 
          src="https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474" 
          alt="BISOU Logo" 
          style="max-width: 300px; width: 100%; height: auto; border-radius: 15px; margin-bottom: 1rem;"
        />
        <p style="margin: 0; opacity: 0.8;">Click the button below to open the Mini App and start purchasing $BISOU tokens!</p>
      </div>
      
      <a 
        href="${baseUrl}/frame-launch" 
        style="display: inline-block; background: white; color: #8B5CF6; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 1.1rem; transition: transform 0.2s;"
        onmouseover="this.style.transform='scale(1.05)'"
        onmouseout="this.style.transform='scale(1)'"
      >
        🚀 Open $BISOU Mini App
      </a>
    </div>
  </body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  })
}

export async function POST(request: NextRequest) {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  try {
    const body = await request.json()
    console.log("Frame interaction:", body)

    return NextResponse.redirect(`${baseUrl}/frame-launch`, 302)
  } catch (error) {
    console.error("Frame POST error:", error)
    return NextResponse.redirect(`${baseUrl}/frame-launch`, 302)
  }
}
