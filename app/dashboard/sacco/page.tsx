"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, DollarSign, TrendingUp, Calendar, Loader2 } from "lucide-react"

export default function SaccoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [saccoData, setSaccoData] = useState<any>(null)
  const [contributionAmount, setContributionAmount] = useState("")
  const [loanAmount, setLoanAmount] = useState("")

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

        const saccoResponse = await fetch("/api/sacco")
        if (saccoResponse.ok) {
          const data = await saccoResponse.json()
          setSaccoData(data.sacco)
        }
      } catch (error) {
        console.error("[v0] SACCO page load error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleContribution = async () => {
    if (!contributionAmount) return

    try {
      const response = await fetch("/api/sacco/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number.parseFloat(contributionAmount) }),
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("[v0] Contribution error:", error)
    }
  }

  const handleLoanRequest = async () => {
    if (!loanAmount) return

    try {
      const response = await fetch("/api/sacco/loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number.parseFloat(loanAmount) }),
      })

      if (response.ok) {
        alert("Loan request submitted successfully!")
      }
    } catch (error) {
      console.error("[v0] Loan request error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !saccoData) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif">Your SACCO</h1>
          <p className="text-muted-foreground">Community savings and lending for gig workers</p>
        </div>

        {/* SACCO Overview */}
        <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-primary-foreground p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold">Your SACCO Account</h2>
              <p className="text-sm opacity-90">{saccoData.members.length} active members</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-75 mb-1">Total Savings</p>
              <p className="text-3xl font-bold">KES {saccoData.balance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm opacity-75 mb-1">Loan Eligible</p>
              <p className="text-3xl font-bold">KES {saccoData.loanEligible.toLocaleString()}</p>
              <p className="text-xs opacity-75 mt-1">2-3x your savings</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-90">Monthly Contribution</span>
              <span className="font-semibold">KES {saccoData.monthlyContribution.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="opacity-90">Next Payout Position</span>
              <span className="font-semibold">#{saccoData.nextPayoutPosition}</span>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Make Contribution */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Make a Contribution</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contribution">Amount (KES)</Label>
                <Input
                  id="contribution"
                  type="number"
                  placeholder="3000"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                />
              </div>
              <Button onClick={handleContribution} className="w-full">
                <DollarSign className="w-4 h-4 mr-2" />
                Contribute Now
              </Button>
              <p className="text-xs text-muted-foreground">
                Regular contributions increase your loan eligibility and payout position
              </p>
            </div>
          </Card>

          {/* Request Loan */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Request a Loan</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loan">Loan Amount (KES)</Label>
                <Input
                  id="loan"
                  type="number"
                  placeholder={`Max: ${saccoData.loanEligible}`}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  max={saccoData.loanEligible}
                />
              </div>
              <Button onClick={handleLoanRequest} className="w-full bg-transparent" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Request Loan
              </Button>
              <p className="text-xs text-muted-foreground">
                You can borrow up to 2-3x your savings. Low interest rates for members.
              </p>
            </div>
          </Card>
        </div>

        {/* How SACCO Works */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">How SACCO Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Save Together</h4>
              <p className="text-sm text-muted-foreground">
                Make regular contributions to build your savings and support the community
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Borrow More</h4>
              <p className="text-sm text-muted-foreground">
                Access loans up to 2-3x your savings at low interest rates
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Rotating Payouts</h4>
              <p className="text-sm text-muted-foreground">
                Members receive lump sum payouts in rotation to fund big projects
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
