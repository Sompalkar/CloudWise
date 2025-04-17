"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Bell, AlertTriangle, AlertCircle, Info } from "lucide-react"
import { Skeleton } from "../ui/skeleton"

export function RecentAlerts() {
  const [loading, setLoading] = useState(true)

  // Simulating data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2200)

    return () => clearTimeout(timer)
  }, [])

  const alerts = [
    {
      id: 1,
      title: "Cost Anomaly Detected",
      description: "EC2 costs increased by 35% in the last 24 hours",
      timestamp: "15 minutes ago",
      severity: "high",
      status: "new",
    },
    {
      id: 2,
      title: "Recommendation Applied",
      description: "3 idle EC2 instances have been terminated",
      timestamp: "2 hours ago",
      severity: "info",
      status: "read",
    },
    {
      id: 3,
      title: "Account Sync Failed",
      description: "GCP Analytics account sync failed due to permission issues",
      timestamp: "3 hours ago",
      severity: "medium",
      status: "new",
    },
    {
      id: 4,
      title: "New Recommendation",
      description: "Potential savings of $120/month by rightsizing RDS instances",
      timestamp: "5 hours ago",
      severity: "low",
      status: "read",
    },
  ]

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "low":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Recent Alerts</CardTitle>
          </div>
          <Badge variant="outline">{alerts.filter((a) => a.status === "new").length} new</Badge>
        </div>
        <CardDescription>Recent notifications and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 rounded-md border p-3 ${
                  alert.status === "new" ? "bg-muted/50" : ""
                }`}
              >
                {getSeverityIcon(alert.severity)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{alert.title}</p>
                    {alert.status === "new" && <Badge variant="outline">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Alerts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
