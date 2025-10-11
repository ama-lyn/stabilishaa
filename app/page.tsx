import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Briefcase, Wallet, TrendingUp, Shield, Users, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold font-serif">Stabilisha</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold font-serif mb-6 text-balance">Your Complete Gig Work Platform</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
            Unified dashboard for gig workers with integrated payments, AI insights, credit scoring, and financial
            protection
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup?type=worker">
              <Button size="lg" className="text-lg">
                I Need a Gig
              </Button>
            </Link>
            <Link href="/signup?type=client">
              <Button size="lg" variant="outline" className="text-lg bg-transparent">
                I Have a Gig
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6">
            <Wallet className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Integrated Wallet</h3>
            <p className="text-muted-foreground leading-relaxed">
              Receive payments directly and track all your gigs automatically with blockchain verification
            </p>
          </Card>

          <Card className="p-6">
            <TrendingUp className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">AI Income Insights</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get predictions on future earnings and smart recommendations to maximize your income
            </p>
          </Card>

          <Card className="p-6">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Credit Scoring</h3>
            <p className="text-muted-foreground leading-relaxed">
              Build your financial passport and access loans based on your gig work history
            </p>
          </Card>

          <Card className="p-6">
            <Users className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">SACCO Integration</h3>
            <p className="text-muted-foreground leading-relaxed">
              Save together and borrow 2-3x your savings with community-backed lending
            </p>
          </Card>

          <Card className="p-6">
            <Zap className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">AI Job Matching</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get matched with gigs that fit your skills and maximize your earning potential
            </p>
          </Card>

          <Card className="p-6">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Insurance Protection</h3>
            <p className="text-muted-foreground leading-relaxed">
              Protect your income and equipment with verified claims using geotagged images
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-3xl mx-auto p-12 text-center bg-primary text-primary-foreground">
          <h2 className="text-3xl font-bold font-serif mb-4">Ready to stabilize your gig income?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of gig workers building their financial future</p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg">
              Create Free Account
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 Stabilisha. Empowering gig workers across Kenya.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
