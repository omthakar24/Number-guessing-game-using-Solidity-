"use client"

import type React from "react"

import { useState } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

interface GameUIProps {
  gameContract: ethers.Contract | null
  account: string | null
  provider: ethers.BrowserProvider | null
  setError: (error: string | null) => void
}

export default function GameUI({ gameContract, account, provider, setError }: GameUIProps) {
  const [guess, setGuess] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [gameResult, setGameResult] = useState<{
    status: "win" | "lose" | null
    message: string
  }>({ status: null, message: "" })

  const handleGuess = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!gameContract || !account) {
      setError("Game contract not initialized")
      return
    }

    const guessNumber = Number.parseInt(guess)
    if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 10) {
      setError("Please enter a number between 1 and 10")
      return
    }

    setLoading(true)
    setError(null)
    setGameResult({ status: null, message: "" })

    try {
      // Call the play function on the smart contract
      // The play function costs 0.01 ETH to call
      const tx = await gameContract.play(guessNumber, {
        value: ethers.parseEther("0.01"),
      })

      // Wait for transaction to be mined
      setGameResult({
        status: null,
        message: "Transaction submitted. Waiting for confirmation...",
      })

      const receipt = await tx.wait()

      // Check for GameResult event to determine win/lose
      const event = receipt.logs
        .filter((log: any) => log.fragment?.name === "GameResult")
        .map((log: any) => gameContract.interface.parseLog(log))[0]

      if (event) {
        const [playerAddress, playerGuess, correctNumber, won] = event.args

        if (won) {
          setGameResult({
            status: "win",
            message: `Congratulations! You guessed the correct number: ${correctNumber}. You won!`,
          })
        } else {
          setGameResult({
            status: "lose",
            message: `Sorry, you guessed ${playerGuess} but the correct number was ${correctNumber}. Try again!`,
          })
        }
      }

      // Refresh balance after game
      if (provider && account) {
        const balance = await provider.getBalance(account)
      }
    } catch (err: any) {
      console.error("Game error:", err)
      setError(err.message || "Error playing the game")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {gameResult.status && (
        <Alert variant={gameResult.status === "win" ? "default" : "destructive"}>
          {gameResult.status === "win" && <CheckCircle2 className="h-4 w-4" />}
          <AlertTitle>{gameResult.status === "win" ? "You Won!" : "You Lost"}</AlertTitle>
          <AlertDescription>{gameResult.message}</AlertDescription>
        </Alert>
      )}

      {gameResult.message && !gameResult.status && (
        <Alert>
          <AlertDescription>{gameResult.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleGuess} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="guess">Enter your guess (1-10)</Label>
          <Input
            id="guess"
            type="number"
            min="1"
            max="10"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter a number between 1-10"
            required
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading || !guess}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Play Game (0.01 ETH)"
          )}
        </Button>
      </form>

      <div className="text-sm text-muted-foreground">
        <p>Game Rules:</p>
        <ul className="list-disc list-inside">
          <li>Guess a number between 1 and 10</li>
          <li>Each play costs 0.01 Sepolia ETH</li>
          <li>Guess correctly to win a prize!</li>
        </ul>
      </div>
    </div>
  )
}

