"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Lightbulb, ArrowRight, Server, Database, HardDrive } from "lucide-react"
import { Skeleton } from "../ui/skeleton"

export function TopRecommendations() {
  const [loading, setLoading] = useState(true)

  // Simulating data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  const recommendations = [
    {
      id: 1,
      title: "Idle EC2 Instances",
      description: "3 instances with <5% CPU utilization for 14 days",
      savings: "$120/month",
      action: "Downsize or terminate",
      severity: "high",
      icon: Server,
    },
    {
      id: 2,
      title: "Unattached EBS Volumes",
      description: "5 volumes not attached to any instance",
      savings: "$45/month",
      action: "Delete volumes",
      severity: "medium",
      icon: HardDrive,
    },
    {
      id: 3,
      title: "Oversized RDS Instances",
      description: "2 instances with low connection count",
      savings: "$80/month",
      action: "Downsize instances",
      severity: "medium",
      icon: Database,
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Potential monthly savings: $245</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            <>
              {recommendations.map((recommendation) => (
                <div key={recommendation.id} className="flex flex-col space-y-2 rounded-md border p-3 animated-border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <recommendation.icon className="mr-2 h-5 w-5 text-primary" />
                      <span className="font-medium">{recommendation.title}</span>
                    </div>
                    <Badge
                      variant={
                        recommendation.severity === "high"
                          ? "destructive"
                          : recommendation.severity === "medium"
                            ? "default"
                            : "outline"
                      }
                    >
                      {recommendation.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">Save {recommendation.savings}</span>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      Apply
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Recommendations
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
