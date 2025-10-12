"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WalletOverview } from "@/components/wallet-overview"
import { TransactionList } from "@/components/transaction-list"
import { IncomeChart } from "@/components/income-chart"
import { QuickActions } from "@/components/quick-actions"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [walletData, setWalletData] = useState<any>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Check authentication
        const authResponse = await fetch("/api/auth/me")
        if (!authResponse.ok) {
          router.push("/login")
          return
        }
        const userData = await authResponse.json()
        setUser(userData)

        // Load wallet data
        const walletResponse = await fetch("/api/wallet")
        if (walletResponse.ok) {
          const data = await walletResponse.json()
          setWalletData(data)
        }
      } catch (error) {
        console.error("[v0] Dashboard load error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !walletData) {
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold font-serif">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">Here's your financial overview</p>
          </div>
          <button 
            onClick={() => {
              const link = document.createElement('a')
              link.href = '/api/reports/pdf'
              link.download = 'stabilisha-financial-report.html'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Report
          </button>
        </div>

        <WalletOverview wallet={walletData.wallet} userType={user.userType} />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <IncomeChart userType={user.userType} />
          </div>
          <div>
            <QuickActions userType={user.userType} />
          </div>
        </div>

        <TransactionList transactions={walletData.transactions} userType={user.userType} />
      </div>
    </DashboardLayout>
  )
}
