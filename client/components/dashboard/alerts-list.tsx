"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { AlertCircle, AlertTriangle, Bell, CheckCircle, Info, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Skeleton } from "../../components/ui/skeleton"
import { useToast } from "../../hooks/use-toast"

interface Alert {
  id: string
  title: string
  message: string
  severity: "critical" | "high" | "medium" | "low" | "info"
  status: "new" | "read" | "acknowledged" | "resolved"
  category: "cost" | "security" | "performance" | "availability" | "other"
  timestamp: string
  provider: "aws" | "azure" | "gcp" | "system"
}

export function AlertsList() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/alerts')
        // const data = await response.json()
        // setAlerts(data.alerts)

        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setAlerts([
          {
            id: "alert-1",
            title: "Cost Anomaly Detected",
            message: "EC2 costs increased by 35% in the last 24 hours",
            severity: "high",
            status: "new",
            category: "cost",
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            provider: "aws",
          },
          {
            id: "alert-2",
            title: "Recommendation Applied",
            message: "3 idle EC2 instances have been terminated",
            severity: "info",
            status: "read",
            category: "cost",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            provider: "aws",
          },
          {
            id: "alert-3",
            title: "Account Sync Failed",
            message: "GCP Analytics account sync failed due to permission issues",
            severity: "medium",
            status: "new",
            category: "other",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            provider: "gcp",
          },
          {
            id: "alert-4",
            title: "New Recommendation",
            message: "Potential savings of $120/month by rightsizing RDS instances",
            severity: "low",
            status: "read",
            category: "cost",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            provider: "aws",
          },
          {
            id: "alert-5",
            title: "Security Group with Unrestricted Access",
            message: "A security group in your AWS account has unrestricted (0.0.0.0/0) access to port 22 (SSH)",
            severity: "critical",
            status: "new",
            category: "security",
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            provider: "aws",
          },
        ])
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load alerts",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlerts()
  }, [toast])

  const handleMarkAsRead = async (alertId: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/alerts/${alertId}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'read' }),
      // })

      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) => (alert.id === alertId ? { ...alert, status: "read" as const } : alert)),
      )

      toast({
        title: "Alert updated",
        description: "Alert marked as read",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alert",
        variant: "destructive",
      })
    }
  }

  const handleResolveAlert = async (alertId: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/alerts/${alertId}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'resolved' }),
      // })

      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" as const } : alert)),
      )

      toast({
        title: "Alert resolved",
        description: "Alert has been marked as resolved",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve alert",
        variant: "destructive",
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      // In a real app, this would be an API call
      // await fetch('/api/alerts/mark-all-read', { method: 'POST' })

      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) => (alert.status === "new" ? { ...alert, status: "read" as const } : alert)),
      )

      toast({
        title: "Alerts updated",
        description: "All alerts marked as read",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alerts",
        variant: "destructive",
      })
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return alert.status === "new"
    if (activeTab === "cost") return alert.category === "cost"
    if (activeTab === "security") return alert.category === "security"
    if (activeTab === "performance") return alert.category === "performance"
    return false
  })

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case "aws":
        return <Badge variant="outline">AWS</Badge>
      case "azure":
        return <Badge variant="outline">Azure</Badge>
      case "gcp":
        return <Badge variant="outline">GCP</Badge>
      case "system":
        return <Badge variant="outline">System</Badge>
      default:
        return null
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge>Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      case "info":
        return <Badge variant="outline">Info</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alerts
          </CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading alerts..."
              : `${alerts.filter((a) => a.status === "new").length} new alerts out of ${alerts.length} total`}
          </CardDescription>
        </div>
        {!isLoading && alerts.some((a) => a.status === "new") && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="cost">Cost</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : filteredAlerts.length > 0 ? (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-md border p-4 ${alert.status === "new" ? "bg-muted/50" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{alert.title}</h4>
                            {alert.status === "new" && <Badge variant="outline">New</Badge>}
                          </div>
                          <div className="flex items-center gap-2">
                            {getProviderBadge(alert.provider)}
                            {getSeverityBadge(alert.severity)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {alert.status === "new" && (
                                  <DropdownMenuItem onClick={() => handleMarkAsRead(alert.id)}>
                                    Mark as read
                                  </DropdownMenuItem>
                                )}
                                {alert.status !== "resolved" && (
                                  <DropdownMenuItem onClick={() => handleResolveAlert(alert.id)}>
                                    Resolve
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/alerts/${alert.id}`}>View details</Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">{formatTimestamp(alert.timestamp)}</p>
                          {alert.status === "resolved" && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No alerts found</h3>
                <p className="text-sm text-muted-foreground">
                  {activeTab === "all"
                    ? "You don't have any alerts at the moment."
                    : `You don't have any ${activeTab} alerts at the moment.`}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
