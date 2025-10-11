"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface IncomeChartProps {
  userType: "worker" | "client"
}

export function IncomeChart({ userType }: IncomeChartProps) {
  // Mock weekly data
  const weeklyData = [
    { day: "Mon", amount: 8500 },
    { day: "Tue", amount: 12000 },
    { day: "Wed", amount: 15500 },
    { day: "Thu", amount: 9000 },
    { day: "Fri", amount: 18000 },
    { day: "Sat", amount: 14000 },
    { day: "Sun", amount: 10450 },
  ]

  const maxAmount = Math.max(...weeklyData.map((d) => d.amount))

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">{userType === "worker" ? "Weekly Earnings" : "Weekly Spending"}</h2>
          <p className="text-sm text-muted-foreground">Last 7 days</p>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">+12.5%</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 h-48">
        {weeklyData.map((data, index) => {
          const height = (data.amount / maxAmount) * 100
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-40">
                <div
                  className="w-full bg-primary rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={`KES ${data.amount.toLocaleString()}`}
                />
              </div>
              <span className="text-xs text-muted-foreground">{data.day}</span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total this week</span>
          <span className="font-bold">KES {weeklyData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</span>
        </div>
      </div>
    </Card>
  )
}
