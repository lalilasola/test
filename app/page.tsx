"use client"

import { useEffect, useState } from "react"
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Loader2, CheckCircle, AlertCircle, Zap } from "lucide-react"
import sdk from "@farcaster/frame-sdk"

const BISOU_CONTRACT = "0x951Ed6e6e75e913494C19173C30C6D3C59CffF8F"
const UNISWAP_V2_ROUTER = "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24"

const SWAP_ABI = [
  {
    name: "swapExactETHForTokens",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    outputs: [{ name: "amounts", type: "uint256[]" }],
  },
] as const

export default function BisouMiniApp() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null)
  const [isSwapping, setIsSwapping] = useState(false)
  const [context, setContext] = useState<any>(null)
  const [isFrameLaunch, setIsFrameLaunch] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const { writeContract, data: hash, error, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Fast SDK initialization with optimizations
  useEffect(() => {
    const initSDK = async () => {
      try {
        // Check URL parameters for frame context
        const urlParams = new URLSearchParams(window.location.search)
        const frameParam = urlParams.get("frame") === "true"
        const loadedParam = urlParams.get("loaded") === "true"

        setIsFrameLaunch(frameParam)

        if (loadedParam) {
          setShowWelcome(true)
          setTimeout(() => setShowWelcome(false), 2000)
        }

        // Parallel SDK loading for better performance
        const [contextResult] = await Promise.allSettled([
          sdk.context,
          // Preload other resources
          fetch("/api/frame", { method: "HEAD" }).catch(() => {}),
        ])

        if (contextResult.status === "fulfilled") {
          setContext(contextResult.value)
          console.log("Farcaster context:", contextResult.value)
        }

        setIsSDKLoaded(true)
      } catch (error) {
        console.error("Failed to load Farcaster SDK:", error)
        setIsSDKLoaded(true)
      }
    }

    initSDK()
  }, [])

  const predefinedAmounts = [
    { label: "50 $BISOU", value: "50", eth: "0.01", popular: false },
    { label: "250 $BISOU", value: "250", eth: "0.05", popular: true },
    { label: "500 $BISOU", value: "500", eth: "0.1", popular: false },
  ]

  const handlePredefinedPurchase = (amount: string, ethAmount: string) => {
    setSelectedAmount(amount)
    handleSwap(ethAmount)
  }

  const handleCustomPurchase = () => {
    if (!customAmount || isNaN(Number(customAmount))) return
    const ethAmount = (Number(customAmount) / 5000).toString()
    setSelectedAmount(customAmount)
    handleSwap(ethAmount)
  }

  const handleSwap = async (ethAmount: string) => {
    if (!isConnected || !address) return

    setIsSwapping(true)

    try {
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20
      const path = ["0x4200000000000000000000000000000000000006", BISOU_CONTRACT]

      await writeContract({
        address: UNISWAP_V2_ROUTER as `0x${string}`,
        abi: SWAP_ABI,
        functionName: "swapExactETHForTokens",
        args: [BigInt(0), path as `0x${string}`[], address, BigInt(deadline)],
        value: parseEther(ethAmount),
      })
    } catch (error) {
      console.error("Swap failed:", error)
    } finally {
      setIsSwapping(false)
    }
  }

  const connectWallet = () => {
    const injectedConnector = connectors.find((connector) => connector.name === "Injected")
    if (injectedConnector) {
      connect({ connector: injectedConnector })
    }
  }

  // Fast loading screen
  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="text-white text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-xl flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
          <p className="text-lg font-medium">Loading $BISOU...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-4">
      {/* Welcome Animation for Frame Users */}
      {showWelcome && (
        <div className="fixed inset-0 bg-purple-600/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center text-white animate-pulse">
            <div className="text-6xl mb-4">💋</div>
            <h1 className="text-3xl font-bold">Welcome to $BISOU!</h1>
            <p className="text-lg opacity-80">Ready to get sweet tokens?</p>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="text-center text-white">
          <div className="relative">
            <h1 className="text-4xl font-bold mb-2">💋 $BISOU</h1>
            {isFrameLaunch && (
              <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 animate-bounce">
                <Zap className="h-3 w-3 mr-1" />
                Live!
              </Badge>
            )}
          </div>
          <p className="text-lg opacity-90">The sweetest token on Base</p>
          {context?.user && (
            <Badge variant="secondary" className="mt-2 animate-fade-in">
              Welcome, {context.user.displayName || context.user.username}! 👋
            </Badge>
          )}
        </div>

        {/* Quick Stats */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center text-white">
              <div>
                <div className="text-2xl font-bold">5K+</div>
                <div className="text-xs opacity-80">Holders</div>
              </div>
              <div>
                <div className="text-2xl font-bold">$0.002</div>
                <div className="text-xs opacity-80">Price</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Base</div>
                <div className="text-xs opacity-80">Network</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Wallet Connection */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Connection
              {isConnected && <CheckCircle className="h-4 w-4 text-green-400" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div className="space-y-3">
                <div className="text-white">
                  <p className="text-sm opacity-80">Connected to:</p>
                  <p className="font-mono text-sm break-all bg-white/10 p-2 rounded">{address}</p>
                </div>
                <Button
                  onClick={() => disconnect()}
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Purchase Options */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Purchase $BISOU</CardTitle>
            <CardDescription className="text-white/80">Choose an amount or enter a custom quantity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Enhanced predefined amounts */}
            <div className="grid grid-cols-1 gap-3">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount.value}
                  onClick={() => handlePredefinedPurchase(amount.value, amount.eth)}
                  disabled={!isConnected || isSwapping || isPending || isConfirming}
                  className={`w-full ${
                    amount.popular
                      ? "bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-400/50"
                      : "bg-white/20 hover:bg-white/30"
                  } text-white border-white/20 justify-between relative`}
                  variant="outline"
                >
                  {amount.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs">Popular</Badge>
                  )}
                  <span>{amount.label}</span>
                  <span className="text-sm opacity-80">~{amount.eth} ETH</span>
                </Button>
              ))}
            </div>

            {/* Enhanced custom amount */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button
                  onClick={handleCustomPurchase}
                  disabled={!isConnected || !customAmount || isSwapping || isPending || isConfirming}
                  className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                >
                  Buy
                </Button>
              </div>
            </div>

            {/* Enhanced transaction status */}
            {(isPending || isConfirming || isConfirmed || error) && (
              <div className="space-y-2 p-3 bg-white/10 rounded-lg">
                {isPending && (
                  <div className="flex items-center gap-2 text-white">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Confirming transaction...</span>
                  </div>
                )}
                {isConfirming && (
                  <div className="flex items-center gap-2 text-white">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Waiting for confirmation...</span>
                  </div>
                )}
                {isConfirmed && (
                  <div className="flex items-center gap-2 text-green-300">
                    <CheckCircle className="h-4 w-4" />
                    <span>Transaction confirmed! 🎉</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Transaction failed: {error.message}</span>
                  </div>
                )}
                {hash && (
                  <div className="text-white/80 text-xs">
                    <span>Transaction: </span>
                    <span className="font-mono bg-white/10 px-2 py-1 rounded">
                      {hash.slice(0, 10)}...{hash.slice(-8)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {!isConnected && (
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-white/60 text-sm">Connect your wallet to start purchasing $BISOU tokens</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Footer */}
        <div className="text-center text-white/60 text-xs space-y-1">
          <p>Powered by Farcaster Mini Apps • Base Network</p>
          {isFrameLaunch && <p className="text-yellow-400">⚡ Launched from Farcaster Frame</p>}
        </div>
      </div>
    </div>
  )
}
