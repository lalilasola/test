"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function FrameLaunchPage() {
  const router = useRouter()
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Initializing...")

  useEffect(() => {
    // Simulate loading progress for better UX
    const loadingSteps = [
      { progress: 20, text: "Loading $BISOU Mini App..." },
      { progress: 40, text: "Connecting to Base network..." },
      { progress: 60, text: "Preparing wallet integration..." },
      { progress: 80, text: "Almost ready..." },
      { progress: 100, text: "Welcome to $BISOU!" },
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingProgress(loadingSteps[currentStep].progress)
        setLoadingText(loadingSteps[currentStep].text)
        currentStep++
      } else {
        clearInterval(interval)
        // Quick redirect to main app
        setTimeout(() => {
          router.push("/?frame=true&loaded=true")
        }, 300)
      }
    }, 200) // Fast 200ms intervals for smooth experience

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-sm w-full">
        {/* Logo */}
        <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
          <div className="text-center">
            <div className="text-3xl mb-1">💋</div>
            <div className="text-purple-600 font-bold text-sm">BISOU</div>
          </div>
        </div>

        {/* Loading Text */}
        <h1 className="text-xl font-bold mb-4">{loadingText}</h1>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <p className="text-sm opacity-80">{loadingProgress}% Complete</p>

        {/* Preload critical resources */}
        <div className="hidden">
          <link rel="preload" href="/" as="document" />
          <link rel="preload" href="/api/frame" as="fetch" />
        </div>
      </div>
    </div>
  )
}
