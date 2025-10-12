"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface Transaction {
  _id: string
  type: string
  amount: number
  currency: string
  status: string
  description: string
  createdAt: string
  blockchainHash?: string
  invoiceNumber?: string
}

interface TransactionListProps {
  transactions: Transaction[]
  userType: "worker" | "client"
}

export function TransactionList({ transactions, userType }: TransactionListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    if (type === "received" || type === "deposit") {
      return <ArrowDownRight className="w-4 h-4 text-green-600" />
    }
    return <ArrowUpRight className="w-4 h-4 text-red-600" />
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
        <Badge variant="secondary">{transactions.length} transactions</Badge>
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No transactions yet</p>
        ) : (
          transactions.map((transaction, index) => (
            <div
              key={transaction._id || transaction.id || index}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {getTypeIcon(transaction.type)}
                </div>
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                    {transaction.blockchainHash && (
                      <>
                        <span>•</span>
                        <span className="font-mono">{transaction.blockchainHash.slice(0, 10)}...</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold ${transaction.amount > 0 ? "text-green-600" : transaction.amount < 0 ? "text-red-600" : ""}`}
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.currency} {Math.abs(transaction.amount).toLocaleString()}
                </p>
                <div className="flex items-center gap-1 justify-end">
                  {getStatusIcon(transaction.status)}
                  <span className="text-xs text-muted-foreground capitalize">{transaction.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
