"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Camera, MapPin, CheckCircle, Loader2 } from "lucide-react"

export default function InsurancePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [insuranceData, setInsuranceData] = useState<any>(null)
  const [showClaimForm, setShowClaimForm] = useState(false)
  const [claimForm, setClaimForm] = useState({
    type: "",
    amount: "",
    description: "",
  })

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

        const insuranceResponse = await fetch("/api/insurance")
        if (insuranceResponse.ok) {
          const data = await insuranceResponse.json()
          setInsuranceData(data.insurance)
        }
      } catch (error) {
        console.error("[v0] Insurance page load error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleClaimSubmit = async () => {
    try {
      const response = await fetch("/api/insurance/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(claimForm),
      })

      if (response.ok) {
        alert("Claim submitted successfully! Please upload geotagged images for verification.")
        setShowClaimForm(false)
        window.location.reload()
      }
    } catch (error) {
      console.error("[v0] Claim submission error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !insuranceData) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif">Insurance Protection</h1>
          <p className="text-muted-foreground">Protect your income and equipment with verified claims</p>
        </div>

        {/* Insurance Overview */}
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-primary-foreground p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold">Your Coverage</h2>
              <p className="text-sm opacity-90">Total Coverage: KES {insuranceData.totalCoverage.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {insuranceData.policies.map((policy: any, index: number) => (
              <div key={index} className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold capitalize">{policy.type.replace(/_/g, " ")}</p>
                  <Badge className={policy.status === "active" ? "bg-green-600" : "bg-gray-600"}>{policy.status}</Badge>
                </div>
                <p className="text-sm opacity-90 mb-1">Coverage: {policy.coverage}</p>
                <p className="text-xs opacity-75">Premium: KES {policy.premium}/month</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Claims Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">File a Claim</h3>
            {!showClaimForm ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Need to file an insurance claim? We use geotagged images to verify claims and prevent fraud.
                </p>
                <Button onClick={() => setShowClaimForm(true)} className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Start New Claim
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Claim Type</Label>
                  <select
                    id="type"
                    className="w-full p-2 border border-input rounded-md bg-background"
                    value={claimForm.type}
                    onChange={(e) => setClaimForm({ ...claimForm, type: e.target.value })}
                  >
                    <option value="">Select type</option>
                    <option value="income_protection">Income Protection</option>
                    <option value="equipment">Equipment Damage</option>
                    <option value="health">Health</option>
                    <option value="accident">Accident</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Claim Amount (KES)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="10000"
                    value={claimForm.amount}
                    onChange={(e) => setClaimForm({ ...claimForm, amount: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what happened..."
                    rows={3}
                    value={claimForm.description}
                    onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleClaimSubmit} className="flex-1">
                    Submit Claim
                  </Button>
                  <Button variant="outline" onClick={() => setShowClaimForm(false)} className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Recent Claims</h3>
            <div className="space-y-3">
              {insuranceData.claims.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No claims filed yet</p>
              ) : (
                insuranceData.claims.map((claim: any) => (
                  <div
                    key={claim._id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold capitalize">{claim.type.replace(/_/g, " ")}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(claim.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">KES {claim.amount.toLocaleString()}</p>
                      <Badge
                        variant={
                          claim.status === "approved"
                            ? "default"
                            : claim.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {claim.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Geotagged Verification Info */}
        <Card className="p-6 bg-accent/50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-2">Geotagged Image Verification</h3>
              <p className="text-sm text-muted-foreground mb-3">
                To prevent fraud, all insurance claims require geotagged images. Our system verifies:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Location data matches claim location
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Timestamp is recent and authentic
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Images are not duplicates or fake
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Blockchain verification for authenticity
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
