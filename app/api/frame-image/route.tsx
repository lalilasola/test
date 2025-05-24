import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

const frameVariants = {
  original: {
    title: "$BISOU Mini App",
    subtitle: "Purchase tokens on Base",
    backgroundColor: "#8B5CF6",
    gradientTo: "#EC4899",
    emoji: "💋",
    style: "modern",
  },
  urgent: {
    title: "🔥 $BISOU SALE!",
    subtitle: "Limited Time - Act Fast!",
    backgroundColor: "#DC2626",
    gradientTo: "#F59E0B",
    emoji: "🚀",
    style: "urgent",
  },
  minimal: {
    title: "$BISOU",
    subtitle: "Trade on Base",
    backgroundColor: "#000000",
    gradientTo: "#374151",
    emoji: "💋",
    style: "minimal",
  },
  community: {
    title: "Join $BISOU",
    subtitle: "Sweetest Community",
    backgroundColor: "#EC4899",
    gradientTo: "#8B5CF6",
    emoji: "💕",
    style: "community",
  },
  professional: {
    title: "$BISOU Token",
    subtitle: "Professional DeFi Trading",
    backgroundColor: "#1F2937",
    gradientTo: "#4F46E5",
    emoji: "📈",
    style: "professional",
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const variant = searchParams.get("variant") || "original"

  const config = frameVariants[variant as keyof typeof frameVariants] || frameVariants.original

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(45deg, ${config.backgroundColor} 0%, ${config.gradientTo} 100%)`,
        fontSize: 32,
        fontWeight: 600,
        color: "white",
        position: "relative",
      }}
    >
      {/* Background Pattern */}
      {config.style === "urgent" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)",
          }}
        />
      )}

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.1)",
          padding: config.style === "minimal" ? 30 : 50,
          borderRadius: config.style === "minimal" ? 10 : 25,
          backdropFilter: "blur(10px)",
          border: config.style === "professional" ? "2px solid rgba(255,255,255,0.2)" : "none",
          boxShadow: config.style === "urgent" ? "0 0 50px rgba(255,255,255,0.3)" : "none",
        }}
      >
        {/* Emoji */}
        <div style={{ fontSize: config.style === "minimal" ? 60 : 80, marginBottom: 20 }}>{config.emoji}</div>

        {/* Title */}
        <div
          style={{
            fontSize: config.style === "minimal" ? 48 : config.style === "urgent" ? 56 : 52,
            fontWeight: "bold",
            marginBottom: 15,
            textAlign: "center",
            textShadow: config.style === "urgent" ? "2px 2px 4px rgba(0,0,0,0.5)" : "none",
          }}
        >
          {config.title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: config.style === "minimal" ? 20 : 24,
            opacity: config.style === "minimal" ? 0.7 : 0.9,
            textAlign: "center",
            marginBottom: config.style === "urgent" ? 20 : 0,
          }}
        >
          {config.subtitle}
        </div>

        {/* Urgent indicator */}
        {config.style === "urgent" && (
          <div
            style={{
              fontSize: 18,
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: "8px 16px",
              borderRadius: 20,
              animation: "pulse 2s infinite",
            }}
          >
            ⏰ Don't Miss Out!
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          fontSize: 16,
          opacity: 0.8,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>🔗 Base Network</span>
        <span>•</span>
        <span>💎 Premium Token</span>
        {config.style === "professional" && (
          <>
            <span>•</span>
            <span>📊 DeFi Ready</span>
          </>
        )}
      </div>

      {/* Variant indicator (for testing) */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          fontSize: 12,
          opacity: 0.5,
          backgroundColor: "rgba(0,0,0,0.3)",
          padding: "4px 8px",
          borderRadius: 4,
        }}
      >
        {variant}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
