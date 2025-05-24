"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FrameLaunchPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main app with frame parameter
    router.push("/?frame=true")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">❤️</div>
            <div className="text-purple-600 font-bold">BISOU</div>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Loading $BISOU Mini App...</h1>
        <p className="opacity-80">Please wait while we prepare your experience</p>
      </div>
    </div>
  )
}
