"use client"

import { useEffect, useState } from "react"
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ExternalLink, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import sdk from "@farcaster/frame-sdk"

const BISOU_CONTRACT = "0x951Ed6e6e75e913494C19173C30C6D3C59CffF8F"
const UNISWAP_V2_ROUTER = "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24" // Base Uniswap V2 Router

// Simple ERC20 swap ABI for demonstration
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

  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const { writeContract, data: hash, error, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Initialize Farcaster SDK
  useEffect(() => {
    const initSDK = async () => {
      try {
        const context = await sdk.context
        setContext(context)
        setIsSDKLoaded(true)
        console.log("Farcaster context:", context)
      } catch (error) {
        console.error("Failed to load Farcaster SDK:", error)
        setIsSDKLoaded(true) // Still show the app even if SDK fails
      }
    }

    initSDK()
  }, [])

  const predefinedAmounts = [
    { label: "50 $BISOU", value: "50", eth: "0.01" },
    { label: "250 $BISOU", value: "250", eth: "0.05" },
    { label: "500 $BISOU", value: "500", eth: "0.1" },
  ]

  const handlePredefinedPurchase = (amount: string, ethAmount: string) => {
    setSelectedAmount(amount)
    handleSwap(ethAmount)
  }

  const handleCustomPurchase = () => {
    if (!customAmount || isNaN(Number(customAmount))) return

    // Simple calculation: assume 1 ETH = 5000 BISOU (adjust based on actual rate)
    const ethAmount = (Number(customAmount) / 5000).toString()
    setSelectedAmount(customAmount)
    handleSwap(ethAmount)
  }

  const handleSwap = async (ethAmount: string) => {
    if (!isConnected || !address) return

    setIsSwapping(true)

    try {
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes
      const path = [
        "0x4200000000000000000000000000000000000006", // WETH on Base
        BISOU_CONTRACT,
      ]

      await writeContract({
        address: UNISWAP_V2_ROUTER as `0x${string}`,
        abi: SWAP_ABI,
        functionName: "swapExactETHForTokens",
        args: [
          BigInt(0), // amountOutMin (0 for simplicity, should calculate slippage)
          path as `0x${string}`[],
          address,
          BigInt(deadline),
        ],
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

  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="text-white text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading $BISOU Mini App...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-2">💋 $BISOU</h1>
          <p className="text-lg opacity-90">The sweetest token on Base</p>
          {context?.user && (
            <Badge variant="secondary" className="mt-2">
              Welcome, {context.user.displayName || context.user.username}!
            </Badge>
          )}
        </div>

        {/* Wallet Connection */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div className="space-y-3">
                <div className="text-white">
                  <p className="text-sm opacity-80">Connected to:</p>
                  <p className="font-mono text-sm break-all">{address}</p>
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
              <Button onClick={connectWallet} className="w-full bg-white text-purple-600 hover:bg-white/90">
                Connect Wallet
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Token Info */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Token Information</CardTitle>
          </CardHeader>
          <CardContent className="text-white space-y-2">
            <div className="flex justify-between">
              <span className="opacity-80">Network:</span>
              <span>Base</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-80">Symbol:</span>
              <span>$BISOU</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-80">Contract:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs">
                  {BISOU_CONTRACT.slice(0, 6)}...{BISOU_CONTRACT.slice(-4)}
                </span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Options */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Purchase $BISOU</CardTitle>
            <CardDescription className="text-white/80">Choose an amount or enter a custom quantity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Predefined amounts */}
            <div className="grid grid-cols-1 gap-3">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount.value}
                  onClick={() => handlePredefinedPurchase(amount.value, amount.eth)}
                  disabled={!isConnected || isSwapping || isPending || isConfirming}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20 justify-between"
                  variant="outline"
                >
                  <span>{amount.label}</span>
                  <span className="text-sm opacity-80">~{amount.eth} ETH</span>
                </Button>
              ))}
            </div>

            {/* Custom amount */}
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
                  className="bg-white text-purple-600 hover:bg-white/90"
                >
                  Buy
                </Button>
              </div>
            </div>

            {/* Transaction Status */}
            {(isPending || isConfirming || isConfirmed || error) && (
              <div className="space-y-2">
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
                    <span>Transaction confirmed!</span>
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
                    <span className="font-mono">
                      {hash.slice(0, 10)}...{hash.slice(-8)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {!isConnected && (
              <p className="text-white/60 text-sm text-center">Connect your wallet to start purchasing $BISOU tokens</p>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-white/60 text-xs">
          <p>Powered by Farcaster Mini Apps • Base Network</p>
        </div>
      </div>
    </div>
  )
}
