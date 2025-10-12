"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Star, Loader2, CreditCard, Heart, Briefcase, DollarSign, Plus, ArrowLeft } from "lucide-react"

interface InsuranceType {
  id: string
  name: string
  description: string
  icon: any
  packages: InsurancePackage[]
}

interface InsurancePackage {
  id: string
  name: string
  description: string
  coverage: number
  premium: number
  features: string[]
  recommended?: boolean
}

interface ActiveInsurance {
  type: string
  package: InsurancePackage
  activatedAt: Date
}

export default function InsurancePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [creditScore, setCreditScore] = useState<any>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const [paymentForm, setPaymentForm] = useState({ phone: "" })
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [activeInsurances, setActiveInsurances] = useState<ActiveInsurance[]>([
    {
      type: "health",
      package: {
        id: "health-basic",
        name: "Health Basic",
        description: "Essential health coverage",
        coverage: 200000,
        premium: 800,
        features: ["Outpatient care", "Emergency treatment", "Prescription drugs"]
      },
      activatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  ])
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<InsurancePackage | null>(null)
  const [viewingInsurance, setViewingInsurance] = useState<ActiveInsurance | null>(null)
  const [showClaimForm, setShowClaimForm] = useState(false)
  const [claimForm, setClaimForm] = useState({ type: "", amount: "", description: "" })

  const insuranceTypes: InsuranceType[] = [
    {
      id: "health",
      name: "Health Insurance",
      description: "Medical and health coverage",
      icon: Heart,
      packages: [
        {
          id: "health-basic",
          name: "Health Basic",
          description: "Essential health coverage",
          coverage: 200000,
          premium: 800,
          features: ["Outpatient care", "Emergency treatment", "Prescription drugs"]
        },
        {
          id: "health-premium",
          name: "Health Premium",
          description: "Comprehensive health coverage",
          coverage: 500000,
          premium: 1500,
          features: ["Full medical coverage", "Specialist consultations", "Surgery coverage", "Dental care"],
          recommended: true
        }
      ]
    },
    {
      id: "business",
      name: "Business/Equipment",
      description: "Protect your work tools and equipment",
      icon: Briefcase,
      packages: [
        {
          id: "business-basic",
          name: "Equipment Basic",
          description: "Basic equipment protection",
          coverage: 100000,
          premium: 600,
          features: ["Laptop/computer coverage", "Phone protection", "Basic tools coverage"]
        },
        {
          id: "business-premium",
          name: "Business Premium",
          description: "Full business protection",
          coverage: 300000,
          premium: 1200,
          features: ["All equipment coverage", "Business interruption", "Liability protection", "Data recovery"],
          recommended: true
        }
      ]
    },
    {
      id: "income",
      name: "Income Protection",
      description: "Secure your earning potential",
      icon: DollarSign,
      packages: [
        {
          id: "income-basic",
          name: "Income Basic",
          description: "Basic income protection",
          coverage: 150000,
          premium: 700,
          features: ["60% income replacement", "Short-term disability", "Job loss protection"]
        },
        {
          id: "income-premium",
          name: "Income Premium",
          description: "Comprehensive income security",
          coverage: 400000,
          premium: 1400,
          features: ["80% income replacement", "Long-term disability", "Career transition support", "Training allowance"],
          recommended: true
        }
      ]
    }
  ]

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

        const creditResponse = await fetch("/api/credit-score")
        if (creditResponse.ok) {
          const creditData = await creditResponse.json()
          setCreditScore(creditData.creditScore)
        }
      } catch (error) {
        console.error("[v0] Insurance page load error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const getRecommendedPackage = (packages: InsurancePackage[]) => {
    if (!creditScore) return packages.find(p => p.recommended)?.id || packages[0].id
    
    if (creditScore.score >= 700) return packages[packages.length - 1].id
    return packages.find(p => p.recommended)?.id || packages[0].id
  }

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId)
  }

  const handleSelectPackage = (pkg: InsurancePackage) => {
    setSelectedPackage(pkg)
    setShowPaymentModal(true)
  }

  const hasInsuranceType = (typeId: string) => {
    return activeInsurances.some(ins => ins.type === typeId)
  }

  const handlePayment = async () => {
    if (!paymentForm.phone) {
      alert("Please enter your phone number")
      return
    }

    setPaymentLoading(true)
    
    // Simulate payment processing for 6 seconds
    setTimeout(() => {
      setPaymentLoading(false)
      setPaymentSuccess(true)
    }, 6000)
  }

  const handleSuccessClose = () => {
    if (selectedPackage && selectedType) {
      setActiveInsurances(prev => [...prev, {
        type: selectedType,
        package: selectedPackage,
        activatedAt: new Date()
      }])
    }
    setPaymentSuccess(false)
    setShowPaymentModal(false)
    setSelectedType(null)
    setSelectedPackage(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  // Show individual insurance details
  if (viewingInsurance) {
    return (
      <DashboardLayout user={user}>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setViewingInsurance(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Insurance
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-bold font-serif">{viewingInsurance.package.name}</h1>
            <p className="text-muted-foreground">Manage your {insuranceTypes.find(t => t.id === viewingInsurance.type)?.name}</p>
          </div>

          {/* Insurance Details */}
          <Card className="relative text-white p-6 overflow-hidden" style={{backgroundImage: 'url(/red_african_pattern.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-12 h-12" />
              <div>
                <h2 className="text-2xl font-bold">{viewingInsurance.package.name}</h2>
                <p className="text-sm opacity-90">Active since {viewingInsurance.activatedAt.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm opacity-90">Monthly Premium</p>
                <p className="text-xl font-bold">KES {viewingInsurance.package.premium.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm opacity-90">Coverage</p>
                <p className="text-xl font-bold">KES {viewingInsurance.package.coverage.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm opacity-90">Status</p>
                <p className="text-xl font-bold">Active</p>
              </div>
            </div>
            </div>
          </Card>

          {/* Claims Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">File a Claim</h3>
              {!showClaimForm ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    File a claim for your {insuranceTypes.find(t => t.id === viewingInsurance.type)?.name}.
                  </p>
                  <Button onClick={() => setShowClaimForm(true)} className="w-full">
                    Start New Claim
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
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
                    <Input
                      id="description"
                      placeholder="Describe what happened..."
                      value={claimForm.description}
                      onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => alert("Claim submitted successfully!")} className="flex-1">
                      Submit Claim
                    </Button>
                    <Button variant="outline" onClick={() => setShowClaimForm(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Recent Claims</h3>
              <div className="text-center py-8">
                <p className="text-muted-foreground">No claims filed yet</p>
                <p className="text-sm text-muted-foreground mt-2">Your claims will appear here once submitted</p>
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show package selection for selected type
  if (selectedType) {
    const type = insuranceTypes.find(t => t.id === selectedType)!
    const recommendedPackageId = getRecommendedPackage(type.packages)

    return (
      <DashboardLayout user={user}>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setSelectedType(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Insurance Types
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-bold font-serif">{type.name}</h1>
            <p className="text-muted-foreground">{type.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {type.packages.map((pkg) => {
              const isRecommended = pkg.id === recommendedPackageId
              return (
                <Card key={pkg.id} className={`p-6 relative ${isRecommended ? 'ring-2 ring-primary' : ''}`}>
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Recommended
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <type.icon className="w-12 h-12 mx-auto mb-3 text-primary" />
                    <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{pkg.description}</p>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">KES {pkg.premium.toLocaleString()}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Coverage up to KES {pkg.coverage.toLocaleString()}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => handleSelectPackage(pkg)} 
                    className={`w-full ${isRecommended ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={isRecommended ? 'default' : 'outline'}
                  >
                    Select Package
                  </Button>
                </Card>
              )
            })}
          </div>

          {/* Payment Modal */}
          {showPaymentModal && selectedPackage && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-background p-8 rounded-lg w-full max-w-md mx-4">
                {paymentSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Insurance package "{selectedPackage.name}" activated successfully!
                    </p>
                    <Button onClick={handleSuccessClose} className="w-full">
                      Continue to Dashboard
                    </Button>
                  </div>
                ) : !paymentLoading ? (
                  <>
                    <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground mb-2">Selected Package</p>
                      <p className="font-semibold">{selectedPackage.name}</p>
                      <p className="text-sm text-muted-foreground">KES {selectedPackage.premium.toLocaleString()}/month</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+254712345678"
                          value={paymentForm.phone}
                          onChange={(e) => setPaymentForm({ phone: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <Button onClick={handlePayment} className="flex-1">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay Now
                      </Button>
                      <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
                    <p className="text-sm text-muted-foreground">Please enter your PIN when prompted via STK push...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    )
  }

  // Show main insurance dashboard
  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif">Insurance Dashboard</h1>
          <p className="text-muted-foreground">Manage your insurance coverage</p>
        </div>

        {/* Active Insurances */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Active Insurances</h2>
            <Button onClick={() => setSelectedType(null)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add New Insurance
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeInsurances.map((insurance, index) => {
              const type = insuranceTypes.find(t => t.id === insurance.type)!
              return (
                <Card key={index} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setViewingInsurance(insurance)}>
                  <div className="flex items-center gap-3 mb-3">
                    <type.icon className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">{type.name}</h3>
                      <p className="text-sm text-muted-foreground">{insurance.package.name}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">Premium: KES {insurance.package.premium.toLocaleString()}/month</p>
                    <p className="text-sm">Coverage: KES {insurance.package.coverage.toLocaleString()}</p>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Available Insurance Types */}
        <div>
          <h2 className="text-xl font-bold mb-4">Available Insurance Types</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {insuranceTypes.map((type) => {
              const hasThis = hasInsuranceType(type.id)
              return (
                <Card key={type.id} className={`p-6 text-center ${hasThis ? 'opacity-50' : 'cursor-pointer hover:shadow-md'} transition-all`}>
                  <type.icon className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <h3 className="text-xl font-bold mb-2">{type.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{type.description}</p>
                  {hasThis ? (
                    <Badge className="bg-green-100 text-green-800">Already Active</Badge>
                  ) : (
                    <Button onClick={() => handleSelectType(type.id)} className="w-full">
                      Get Coverage
                    </Button>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
