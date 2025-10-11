"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, FileText, CreditCard, TrendingUp } from "lucide-react"

interface QuickActionsProps {
  userType: "worker" | "client"
}

export function QuickActions({ userType }: QuickActionsProps) {
  const workerActions = [
    { icon: Briefcase, label: "Find Gigs", href: "/dashboard/gigs" },
    { icon: FileText, label: "Send Quote", href: "/dashboard/quotes" },
    { icon: CreditCard, label: "Withdraw", href: "/dashboard/wallet" },
    { icon: TrendingUp, label: "View Insights", href: "/dashboard/insights" },
  ]

  const clientActions = [
    { icon: Briefcase, label: "Post Gig", href: "/dashboard/gigs/new" },
    { icon: FileText, label: "View Quotes", href: "/dashboard/quotes" },
    { icon: CreditCard, label: "Add Funds", href: "/dashboard/wallet" },
    { icon: TrendingUp, label: "View Analytics", href: "/dashboard/insights" },
  ]

  const actions = userType === "worker" ? workerActions : clientActions

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        {actions.map((action, index) => (
          <Button key={index} variant="outline" className="w-full justify-start bg-transparent" asChild>
            <a href={action.href}>
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
            </a>
          </Button>
        ))}
      </div>
    </Card>
  )
}
