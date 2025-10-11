"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Eye, EyeOff, TrendingUp, Clock, Send, Download } from "lucide-react"

interface WalletOverviewProps {
  wallet: {
    kesBalance: number
    usdBalance: number
    pendingBalance: number
    totalEarnings: number
    totalSpent: number
  }
  userType: "worker" | "client"
}

export function WalletOverview({ wallet, userType }: WalletOverviewProps) {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Main Balance Card */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm opacity-90 mb-1">{userType === "worker" ? "Available Balance" : "Wallet Balance"}</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold">
                {showBalance ? `KES ${wallet.kesBalance.toLocaleString()}` : "••••••"}
              </p>
              <button onClick={() => setShowBalance(!showBalance)} className="opacity-75 hover:opacity-100">
                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <Wallet className="w-8 h-8 opacity-75" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>
            {userType === "worker"
              ? `+KES ${(wallet.totalEarnings * 0.15).toLocaleString()} this week`
              : `KES ${wallet.totalSpent.toLocaleString()} spent`}
          </span>
        </div>
      </Card>

      {/* USD Balance Card */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm opacity-90 mb-1">USD Balance</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold">{showBalance ? `$${wallet.usdBalance.toLocaleString()}` : "••••••"}</p>
            </div>
          </div>
          <Wallet className="w-8 h-8 opacity-75" />
        </div>
        <p className="text-sm opacity-90">International payments</p>
      </Card>

      {/* Pending Balance (Workers only) */}
      {userType === "worker" && wallet.pendingBalance > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-1">Pending Payments</p>
              <p className="text-2xl font-bold">KES {wallet.pendingBalance.toLocaleString()}</p>
            </div>
            <Clock className="w-8 h-8 opacity-75" />
          </div>
          <p className="text-xs mt-2 opacity-75">Expected in 2-3 days</p>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <p className="text-sm font-semibold mb-3">Quick Actions</p>
        <div className="flex gap-2">
          {userType === "worker" ? (
            <>
              <Button size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-1" />
                Withdraw
              </Button>
              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                <Send className="w-4 h-4 mr-1" />
                Send
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-1" />
                Add Funds
              </Button>
              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                <Send className="w-4 h-4 mr-1" />
                Pay Worker
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
