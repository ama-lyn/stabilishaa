"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Briefcase, Wallet, Shield, Users, Menu, X, LogOut, LayoutDashboard, Sparkles } from "lucide-react"
import { AIChatbot } from "./ai-chatbot"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: any
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { name: "Gigs", href: "/dashboard/gigs", icon: Briefcase },
    { name: "Credit Score", href: "/dashboard/credit", icon: Shield },
    { name: "SACCO", href: "/dashboard/sacco", icon: Users },
    { name: "Insurance", href: "/dashboard/insurance", icon: Shield },
    { name: "AI Insights", href: "/dashboard/insights", icon: Sparkles },
  ]

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden border-b border-border bg-card sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            <span className="font-bold font-serif">Stabilisha</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform lg:translate-x-0 lg:static",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-sidebar-border hidden lg:block">
              <div className="flex items-center gap-2">
                <Briefcase className="w-8 h-8 text-sidebar-primary" />
                <span className="text-xl font-bold font-serif text-sidebar-foreground">Stabilisha</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-sidebar-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sidebar-foreground truncate">{user.name}</p>
                  <p className="text-xs text-sidebar-foreground/60 capitalize">{user.userType}</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-start text-sidebar-foreground" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>

      <AIChatbot />
    </div>
  )
}
