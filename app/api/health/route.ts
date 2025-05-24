import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      frame: "active",
      manifest: "available",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
    },
  )
}
