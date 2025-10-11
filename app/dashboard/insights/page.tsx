"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Target, Loader2 } from "lucide-react"

export default function InsightsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [insights, setInsights] = useState<any[]>([])
  const [predictions, setPredictions] = useState<any>(null)

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

        const insightsResponse = await fetch("/api/ai-insights")
        if (insightsResponse.ok) {
          const data = await insightsResponse.json()
          setInsights(data.insights)
          setPredictions(data.predictions)
        }
      } catch (error) {
        console.error("[v0] Insights page load error:", error)
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

  if (!user) return null

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "prediction":
        return TrendingUp
      case "warning":
        return AlertTriangle
      case "opportunity":
        return Lightbulb
      case "recommendation":
        return Target
      default:
        return Sparkles
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-600"
      case "medium":
        return "bg-yellow-600"
      case "low":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif">AI Insights</h1>
          <p className="text-muted-foreground">Powered by your gig work data and blockchain verification</p>
        </div>

        {/* Income Predictions */}
        {predictions && (
          <Card className="bg-gradient-to-br from-primary to-accent-foreground text-primary-foreground p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Income Prediction</h2>
                <p className="text-sm opacity-90">Based on your work patterns</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm opacity-75 mb-1">This Month</p>
                <p className="text-2xl font-bold">KES {predictions.thisMonth.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm opacity-75 mb-1">Next Month Prediction</p>
                <p className="text-2xl font-bold">KES {predictions.nextMonth.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm opacity-75 mb-1">Confidence</p>
                <p className="text-2xl font-bold">{predictions.confidence}%</p>
              </div>
            </div>
          </Card>
        )}

        {/* AI Insights List */}
        <div className="space-y-4">
          {insights.length === 0 ? (
            <Card className="p-12 text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No insights available yet. Complete more gigs to get AI insights!</p>
            </Card>
          ) : (
            insights.map((insight) => {
              const Icon = getInsightIcon(insight.type)
              return (
                <Card key={insight._id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold">{insight.title}</h3>
                        <Badge className={getPriorityColor(insight.priority)} variant="default">
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{insight.message}</p>
                      {insight.actionable && (
                        <Button size="sm" variant="outline" className="bg-transparent">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {/* Weekly Trends */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Weekly Trends</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-semibold">Average Daily Earnings</p>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">KES 12,350</p>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+15.2%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-semibold">Gigs Completed</p>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">8</p>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+2 from last week</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
