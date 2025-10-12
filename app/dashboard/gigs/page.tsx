"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, MapPin, Clock, DollarSign, Briefcase, Star, Loader2 } from "lucide-react"
import Link from "next/link"

export default function GigsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [gigs, setGigs] = useState<any[]>([])
  const [workers, setWorkers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

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

        // Load gigs
        const gigsResponse = await fetch("/api/gigs")
        if (gigsResponse.ok) {
          const gigsData = await gigsResponse.json()
          setGigs(gigsData.gigs)
        }

        // Load workers (for clients)
        if (userData.userType === "client") {
          const workersResponse = await fetch("/api/workers")
          if (workersResponse.ok) {
            const workersData = await workersResponse.json()
            setWorkers(workersData.workers)
          }
        }
      } catch (error) {
        console.error("[v0] Gigs page load error:", error)
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

  const filteredGigs = gigs.filter(
    (gig) =>
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif">
              {user.userType === "worker" ? "Find Gigs" : "Gig Marketplace"}
            </h1>
            <p className="text-muted-foreground">
              {user.userType === "worker" ? "Browse and apply to available gigs" : "Post gigs or find workers"}
            </p>
          </div>
          {user.userType === "client" && (
            <Link href="/dashboard/gigs/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Post Gig
              </Button>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder={user.userType === "worker" ? "Search gigs..." : "Search gigs or workers..."}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {user.userType === "client" ? (
          <Tabs defaultValue="gigs" className="w-full">
            <TabsList>
              <TabsTrigger value="gigs">Posted Gigs</TabsTrigger>
              <TabsTrigger value="workers">Find Workers</TabsTrigger>
            </TabsList>

            <TabsContent value="gigs" className="space-y-4 mt-6">
              {filteredGigs.length === 0 ? (
                <Card className="p-12 text-center">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No gigs posted yet</p>
                  <Link href="/dashboard/gigs/new">
                    <Button>Post Your First Gig</Button>
                  </Link>
                </Card>
              ) : (
                filteredGigs.map((gig, index) => <GigCard key={gig._id || gig.id || index} gig={gig} userType="client" />)
              )}
            </TabsContent>

            <TabsContent value="workers" className="space-y-4 mt-6">
              {filteredWorkers.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No workers found</p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredWorkers.map((worker) => (
                    <WorkerCard key={worker._id} worker={worker} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            {filteredGigs.length === 0 ? (
              <Card className="p-12 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No gigs available at the moment</p>
              </Card>
            ) : (
              filteredGigs.map((gig, index) => <GigCard key={gig._id || gig.id || index} gig={gig} userType="worker" />)
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function GigCard({ gig, userType }: { gig: any; userType: "worker" | "client" }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{gig.title}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{gig.description}</p>
        </div>
        <Badge>{gig.category}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold">
            {gig.currency} {gig.budget?.toLocaleString() || '0'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{gig.isRemote ? "Remote" : gig.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          <span className="capitalize">{gig.status}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {gig.requiredSkills.slice(0, 3).map((skill: string, index: number) => (
          <Badge key={index} variant="secondary">
            {skill}
          </Badge>
        ))}
        {gig.requiredSkills.length > 3 && <Badge variant="secondary">+{gig.requiredSkills.length - 3} more</Badge>}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{gig.applicants?.length || 0} applicants</span>
        <Link href={`/dashboard/gigs/${gig._id}`}>
          <Button size="sm">{userType === "worker" ? "Apply Now" : "View Details"}</Button>
        </Link>
      </div>
    </Card>
  )
}

function WorkerCard({ worker }: { worker: any }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
          {worker.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="font-bold">{worker.name}</h3>
          <p className="text-sm text-muted-foreground">{worker.category}</p>
        </div>
        {worker.verified && <Badge variant="secondary">Verified</Badge>}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{worker.rating}</span>
        </div>
        <span className="text-sm text-muted-foreground">{worker.totalJobs} jobs</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">
          {worker.hourlyRate ? `KES ${worker.hourlyRate}/hr` : `KES ${worker.projectRate}/project`}
        </span>
        <Link href={`/dashboard/workers/${worker._id}`}>
          <Button size="sm" variant="outline" className="bg-transparent">
            View Profile
          </Button>
        </Link>
      </div>
    </Card>
  )
}
