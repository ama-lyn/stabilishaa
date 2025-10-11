"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WalletOverview } from "@/components/wallet-overview"
import { TransactionList } from "@/components/transaction-list"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Send, Download } from "lucide-react"

export default function WalletPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [walletData, setWalletData] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const authResponse = await fetch("/api/auth/me")
        if (!authResponse.ok) {
          router.push("/login")
          return
        }
        const userData = await authResponse.json()
        setUser(userData)

        const walletResponse = await fetch("/api/wallet")
        if (walletResponse.ok) {
          const data = await walletResponse.json()
          setWalletData(data)
        }
      } catch (error) {
        console.error("[v0] Wallet page load error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !walletData) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif">Wallet</h1>
          <p className="text-muted-foreground">Manage your finances and transactions</p>
        </div>

        <WalletOverview wallet={walletData.wallet} userType={user.userType} />

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">{user.userType === "worker" ? "Withdraw Funds" : "Add Funds"}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (KES)</Label>
                <Input id="amount" type="number" placeholder="5000" />
              </div>
              {user.userType === "worker" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">M-Pesa Number</Label>
                    <Input id="phone" type="tel" placeholder="+254 712 345 678" />
                  </div>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Withdraw to M-Pesa
                  </Button>
                </>
              ) : (
                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Add Funds
                </Button>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Transaction Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Total Transactions</span>
                <span className="font-bold">{walletData.transactions.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">
                  {user.userType === "worker" ? "Total Earned" : "Total Spent"}
                </span>
                <span className="font-bold">
                  KES{" "}
                  {user.userType === "worker"
                    ? walletData.wallet.totalEarnings.toLocaleString()
                    : walletData.wallet.totalSpent.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="font-bold">
                  KES {Math.round(walletData.wallet.totalEarnings * 0.3).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <TransactionList transactions={walletData.transactions} userType={user.userType} />
      </div>
    </DashboardLayout>
  )
}
