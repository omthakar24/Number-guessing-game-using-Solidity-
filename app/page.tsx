"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import GameABI from "@/lib/GameABI.json"
import ConnectWallet from "@/components/connect-wallet"
import GameUI from "@/components/game-ui"

export default function Home() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>("0")
  const [gameContract, setGameContract] = useState<ethers.Contract | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const GAME_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" // Replace with your deployed contract address
  const MIN_BALANCE_TO_PLAY = ethers.parseEther("0.01") // 0.01 Sepolia ETH required to play

  useEffect(() => {
    if (account && provider) {
      checkBalance()
    }
  }, [account, provider])

  const checkBalance = async () => {
    if (!provider || !account) return

    try {
      const balance = await provider.getBalance(account)
      setBalance(ethers.formatEther(balance))

      // Initialize game contract
      if (signer) {
        const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GameABI, signer)
        setGameContract(contract)
      }
    } catch (err) {
      console.error("Error checking balance:", err)
      setError("Failed to check wallet balance")
    }
  }

  const connectWallet = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!window.ethereum) {
        throw new Error("No Ethereum wallet found. Please install MetaMask.")
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()

      // Check if connected to Sepolia (chainId 11155111)
      if (network.chainId !== 11155111n) {
        throw new Error("Please connect to Sepolia testnet")
      }

      await window.ethereum.request({ method: "eth_requestAccounts" })
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      setProvider(provider)
      setSigner(signer)
      setAccount(address)
      setIsConnected(true)
    } catch (err: any) {
      console.error("Connection error:", err)
      setError(err.message || "Failed to connect wallet")
    } finally {
      setLoading(false)
    }
  }

  const hasEnoughBalance = () => {
    if (!balance) return false
    return ethers.parseEther(balance) >= MIN_BALANCE_TO_PLAY
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Number Guessing Game</CardTitle>
          <CardDescription className="text-center">
            Connect your wallet and guess the correct number to win!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isConnected ? (
            <ConnectWallet onConnect={connectWallet} loading={loading} />
          ) : !hasEnoughBalance() ? (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Insufficient Balance</AlertTitle>
                <AlertDescription>
                  You need at least 0.01 Sepolia ETH to play. Your current balance: {balance} ETH
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground">
                Get Sepolia ETH from a faucet like{" "}
                <a
                  href="https://sepoliafaucet.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  sepoliafaucet.com
                </a>
              </p>
            </div>
          ) : (
            <GameUI gameContract={gameContract} account={account} provider={provider} setError={setError} />
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {isConnected && (
            <div className="w-full text-sm text-muted-foreground">
              <p>
                Connected: {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
              </p>
              <p>Balance: {balance} Sepolia ETH</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}

