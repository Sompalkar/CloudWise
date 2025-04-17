"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Lightbulb, Server, Database, HardDrive, MoreHorizontal, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Skeleton } from "../../components/ui/skeleton"
import { useToast } from "../../hooks/use-toast"

interface Recommendation {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  status: "open" | "in_progress" | "implemented" | "dismissed" | "expired"
  recommendationType: string
  provider: "aws" | "azure" | "gcp"
  resourceType: string
  potentialSavings: number
  createdAt: string
}

export function RecommendationsList() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/recommendations')
        // const data = await response.json()
        // setRecommendations(data.recommendations)

        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setRecommendations([
          {
            id: "rec-1",
            title: "Idle EC2 Instances",
            description: "3 instances with <5% CPU utilization for 14 days",
            impact: "high",
            status: "open",
            recommendationType: "termination",
            provider: "aws",
            resourceType: "ec2",
            potentialSavings: 120,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "rec-2",
            title: "Unattached EBS Volumes",
            description: "5 volumes not attached to any instance",
            impact: "medium",
            status: "open",
            recommendationType: "storage",
            provider: "aws",
            resourceType: "ebs",
            potentialSavings: 45,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "rec-3",
            title: "Oversized RDS Instances",
            description: "2 instances with low connection count",
            impact: "medium",
            status: "in_progress",
            recommendationType: "rightsizing",
            provider: "aws",
            resourceType: "rds",
            potentialSavings: 80,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "rec-4",
            title: "Reserved Instance Opportunity",
            description: "Convert 12 consistently running EC2 instances to Reserved Instances",
            impact: "high",
            status: "open",
            recommendationType: "reservation",
            provider: "aws",
            resourceType: "ec2",
            potentialSavings: 1240.5,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "rec-5",
            title: "Optimize Data Transfer Costs",
            description: "Reduce cross-region data transfer by using CloudFront",
            impact: "medium",
            status: "implemented",
            recommendationType: "network",
            provider: "aws",
            resourceType: "network",
            potentialSavings: 215.3,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ])
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load recommendations",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [toast])

  const handleImplement = async (id: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/recommendations/${id}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'implemented' }),
      // })

      setRecommendations((prevRecs) =>
        prevRecs.map((rec) => (rec.id === id ? { ...rec, status: "implemented" as const } : rec)),
      )

      toast({
        title: "Recommendation implemented",
        description: "The recommendation has been marked as implemented",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update recommendation",
        variant: "destructive",
      })
    }
  }

  const handleDismiss = async (id: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/recommendations/${id}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'dismissed' }),
      // })

      setRecommendations((prevRecs) =>
        prevRecs.map((rec) => (rec.id === id ? { ...rec, status: "dismissed" as const } : rec)),
      )

      toast({
        title: "Recommendation dismissed",
        description: "The recommendation has been dismissed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update recommendation",
        variant: "destructive",
      })
    }
  }

  const filteredRecommendations = recommendations.filter((rec) => {
    if (activeTab === "all") return true
    if (activeTab === "open") return rec.status === "open"
    if (activeTab === "high") return rec.impact === "high"
    if (activeTab === "implemented") return rec.status === "implemented"
    return false
  })

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return <Badge variant="destructive">High Impact</Badge>
      case "medium":
        return <Badge>Medium Impact</Badge>
      case "low":
        return <Badge variant="outline">Low Impact</Badge>
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "implemented":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Implemented
          </Badge>
        )
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400"
          >
            In Progress
          </Badge>
        )
      case "dismissed":
        return <Badge variant="outline">Dismissed</Badge>
      case "expired":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400"
          >
            Expired
          </Badge>
        )
      default:
        return <Badge variant="outline">Open</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "termination":
        return <Server className="h-5 w-5 text-red-500" />
      case "rightsizing":
        return <Server className="h-5 w-5 text-amber-500" />
      case "storage":
        return <HardDrive className="h-5 w-5 text-blue-500" />
      case "reservation":
        return <Database className="h-5 w-5 text-purple-500" />
      default:
        return <Lightbulb className="h-5 w-5 text-primary" />
    }
  }

  const formatSavings = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Recommendations
        </CardTitle>
        <CardDescription>AI-powered recommendations to optimize your cloud costs</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="high">High Impact</TabsTrigger>
            <TabsTrigger value="implemented">Implemented</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : filteredRecommendations.length > 0 ? (
              <div className="space-y-4">
                {filteredRecommendations.map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className="flex flex-col space-y-2 rounded-md border p-4 animated-border"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        {getTypeIcon(recommendation.recommendationType)}
                        <span className="ml-2 font-medium">{recommendation.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getImpactBadge(recommendation.impact)}
                        {getStatusBadge(recommendation.status)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span className="text-sm font-medium text-green-600">
                          Save {formatSavings(recommendation.potentialSavings)}/month
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Created on {formatDate(recommendation.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {recommendation.status === "open" && (
                          <>
                            <Button variant="default" size="sm" onClick={() => handleImplement(recommendation.id)}>
                              Implement
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDismiss(recommendation.id)}>
                              Dismiss
                            </Button>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/recommendations/${recommendation.id}`}>View details</Link>
                            </DropdownMenuItem>
                            {recommendation.status === "open" && (
                              <DropdownMenuItem onClick={() => handleImplement(recommendation.id)}>
                                Mark as implemented
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No recommendations found</h3>
                <p className="text-sm text-muted-foreground">
                  {activeTab === "all"
                    ? "You don't have any recommendations at the moment."
                    : `You don't have any ${activeTab} recommendations at the moment.`}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
