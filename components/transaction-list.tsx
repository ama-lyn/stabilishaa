"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface Transaction {
  _id?: string
  reference: string
  transaction_code: number
  amount: number
  currency: string
  email: string
  name: string
  phone: string
  channel: string
  paid_at: string
  status: string
}

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ Mock data for demo
  const mockTransactions: Transaction[] = [
    {
      reference: '1760239162667',
      transaction_code: 5421196965,
      amount: 2,
      currency: 'KES',
      email: 'wilkisndolyn@gmail.com',
      name: 'Gweolyn',
      phone: '0714881998',
      channel: 'mobile_money',
      paid_at: '2025-10-12T03:20:02.000Z',
      status: 'success',
    },
    {
      reference: '1760233678583',
      transaction_code: 5421119678,
      amount: 4,
      currency: 'KES',
      email: 'mugjoy@gmail.com',
      name: 'Joy gao',
      phone: '07432330',
      channel: 'mobile_money',
      paid_at: '2025-10-12T01:49:06.000Z',
      status: 'success',
    },
    {
      reference: '1760230075602',
      transaction_code: 5421080017,
      amount: 2,
      currency: 'KES',
      email: 'mugjoy@gmail.com',
      name: 'Joy gao',
      phone: '0743552330',
      channel: 'mobile_money',
      paid_at: '2025-10-12T00:48:42.000Z',
      status: 'success',
    },
  ]

  useEffect(() => {
    async function fetchTransactions() {
      try {
        // Try fetching from backend API
        const res = await fetch("https://stabilishaa-mpesa-integration.onrender.com/api/transactions")
        const data = await res.json()
        if (data.length > 0) {
          setTransactions(data)
        } else {
          // If backend returns empty, use mock data
          setTransactions(mockTransactions)
        }
      } catch (err) {
        console.error("❌ Failed to load transactions, using mock:", err)
        setTransactions(mockTransactions)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getTypeIcon = (channel: string) => {
    if (channel.toLowerCase().includes("mpesa") || channel.toLowerCase().includes("mobile")) {
      return <ArrowDownRight className="w-4 h-4 text-green-600" />
    }
    return <ArrowUpRight className="w-4 h-4 text-red-600" />
  }

  const formatKenyanTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-KE", {
      timeZone: "Africa/Nairobi",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
        <Badge variant="secondary">{transactions.length} transactions</Badge>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No transactions yet</p>
        ) : (
          transactions.map((tx, index) => (
            <div key={tx._id || index} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {getTypeIcon(tx.channel)}
                </div>
                <div>
                  <p className="font-semibold">{tx.transaction_code || tx.reference}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatKenyanTime(tx.paid_at)}</span>
                    <span>•</span>
                    <span className="capitalize">{tx.channel}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">
                  +{tx.currency} {tx.amount.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 justify-end">
                  {getStatusIcon(tx.status)}
                  <span className="text-xs text-muted-foreground capitalize">{tx.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
