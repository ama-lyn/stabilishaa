"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Loader2,
} from "lucide-react";

export default function CreditScorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [creditData, setCreditData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const authResponse = await fetch("/api/auth/me");
        if (!authResponse.ok) {
          router.push("/login");
          return;
        }
        const userData = await authResponse.json();
        setUser(userData);

        const creditResponse = await fetch("/api/credit-score");
        if (creditResponse.ok) {
          const data = await creditResponse.json();
          setCreditData(data);
        }
      } catch (error) {
        console.error("[v0] Credit page load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !creditData) return null;

  const { creditScore } = creditData;

  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-blue-600";
    if (score >= 550) return "text-yellow-600";
    return "text-red-600";
  };

  const getFactorStatus = (score: number) => {
    if (score >= 90)
      return { icon: CheckCircle, color: "text-green-600", label: "Excellent" };
    if (score >= 75)
      return { icon: CheckCircle, color: "text-blue-600", label: "Good" };
    if (score >= 60)
      return { icon: AlertCircle, color: "text-yellow-600", label: "Fair" };
    return {
      icon: AlertCircle,
      color: "text-red-600",
      label: "Needs Improvement",
    };
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif">
            Your Financial Passport
          </h1>
          <p className="text-muted-foreground">
            Build your credit score through consistent gig work
          </p>
        </div>

        {/* Main Credit Score Card */}
        <Card
          className="relative p-8 text-center text-white overflow-hidden"
          style={{
            backgroundImage: "url(/red_african_pattern.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10">
            <Shield className="w-20 h-20 mx-auto mb-6 opacity-90" />
            <p className="text-lg opacity-90 mb-3">Your Credit Score</p>
            <div className="text-8xl font-bold mb-4">{creditScore.score}</div>
            <p className="text-3xl font-semibold mb-6">{creditScore.rating}</p>
            <p className="text-lg opacity-90">Better than 67% of gig workers</p>
            {creditScore.aiPowered && (
              <p className="text-base opacity-75 mt-3">AI-Powered Scoring</p>
            )}
          </div>
        </Card>

        {/* Score Factors */}
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(creditScore.factors).map(
            ([key, value]: [string, any]) => {
              const status = getFactorStatus(value);
              const StatusIcon = status.icon;
              return (
                <Card key={key} className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <StatusIcon className={`w-5 h-5 ${status.color}`} />
                  </div>
                  <div className="space-y-2">
                    <Progress value={value} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{value}%</span>
                      <span className={status.color}>{status.label}</span>
                    </div>
                  </div>
                </Card>
              );
            }
          )}
        </div>

        {/* Loan Eligibility */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Loan Eligibility</h2>
          <div className="space-y-4">
            {creditScore.loanEligibility.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Complete more gigs to unlock loan eligibility
              </p>
            ) : (
              creditScore.loanEligibility.map((loan: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{loan.lender}</p>
                    <p className="text-sm text-muted-foreground">
                      Interest Rate: {loan.interestRate}% per month
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      KES {loan.maxAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* How to Improve */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">How to Improve Your Score</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Complete More Gigs</p>
                <p className="text-sm text-muted-foreground">
                  Consistent work history improves your gig consistency score
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Maintain Positive Balance</p>
                <p className="text-sm text-muted-foreground">
                  Keep your wallet balance healthy to boost financial health
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Get Paid On Time</p>
                <p className="text-sm text-muted-foreground">
                  Timely payments from clients improve your payment history
                  score
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
