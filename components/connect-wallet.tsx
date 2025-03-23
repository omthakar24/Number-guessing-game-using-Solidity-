"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ConnectWalletProps {
  onConnect: () => Promise<void>
  loading: boolean
}

export default function ConnectWallet({ onConnect, loading }: ConnectWalletProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <p className="text-center text-muted-foreground">Connect your wallet on Sepolia testnet to play the game.</p>
      <Button onClick={onConnect} disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          "Connect Wallet"
        )}
      </Button>
      <div className="text-sm text-muted-foreground">
        <p>Requirements:</p>
        <ul className="list-disc list-inside">
          <li>MetaMask or compatible wallet</li>
          <li>Connected to Sepolia testnet</li>
          <li>Minimum 0.01 Sepolia ETH</li>
        </ul>
      </div>
    </div>
  )
}

