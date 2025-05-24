import { NextResponse } from "next/server"

export async function GET() {
  // Use the exact Vercel URL from the screenshot
  const baseUrl = "https://v0-farcaster-mini-clenmcbwx-lalilasolas-projects.vercel.app"

  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhkNDJmMjhkNzc4MWQ0ZGY4YzI2YWY3ZTY4ZmY3NzY5YjcxNzJkNzQ4In0",
      payload: "eyJkb21haW4iOiJ2MC1mYXJjYXN0ZXItbWluaS1jbGVubWNid3gtbGFsaWxhc29sYXMtcHJvamVjdHMudmVyY2VsLmFwcCJ9",
      signature: "MHhkNDJmMjhkNzc4MWQ0ZGY4YzI2YWY3ZTY4ZmY3NzY5YjcxNzJkNzQ4",
    },
    frame: {
      version: "next",
      name: "$BISOU Mini App",
      iconUrl: "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
      splashImageUrl: "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
      splashBackgroundColor: "#8B5CF6",
      homeUrl: baseUrl,
      imageUrl: "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
      buttonTitle: "Open $BISOU Mini App",
      webhookUrl: `${baseUrl}/api/frame`,
    },
  }

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
