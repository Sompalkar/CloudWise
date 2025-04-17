"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Chart, ChartContainer, ChartLegend, ChartLegendItem } from "../../components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Skeleton } from "../../components/ui/skeleton"
import { AlertCircle, AlertTriangle, Bell, Info } from "lucide-react"

export function AlertsSummary() {
  const [isLoading, setIsLoading] = useState(true)
  const [alertData, setAlertData] = useState<any>(null)

  useEffect(() => {
    const fetchAlertSummary = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/alerts/summary')
        // const data = await response.json()
        // setAlertData(data)

        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1200))
        setAlertData({
          totalCount: 24,
          byStatus: {
            new: 5,
            read: 8,
            acknowledged: 6,
            resolved: 5,
          },
          bySeverity: {
            critical: 2,
            high: 4,
            medium: 8,
            low: 6,
            info: 4,
          },
          byCategory: {
            cost: 10,
            security: 6,
            performance: 4,
            availability: 3,
            other: 1,
          },
        })
      } catch (error) {
        console.error("Error fetching alert summary:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlertSummary()
  }, [])

  const severityData = alertData
    ? [
        { name: "Critical", value: alertData.bySeverity.critical, color: "#ef4444" },
        { name: "High", value: alertData.bySeverity.high, color: "#f97316" },
        { name: "Medium", value: alertData.bySeverity.medium, color: "#f59e0b" },
        { name: "Low", value: alertData.bySeverity.low, color: "#84cc16" },
        { name: "Info", value: alertData.bySeverity.info, color: "#3b82f6" },
      ]
    : []

  const categoryData = alertData
    ? [
        { name: "Cost", value: alertData.byCategory.cost, color: "#10b981" },
        { name: "Security", value: alertData.byCategory.security, color: "#6366f1" },
        { name: "Performance", value: alertData.byCategory.performance, color: "#f59e0b" },
        { name: "Availability", value: alertData.byCategory.availability, color: "#ec4899" },
        { name: "Other", value: alertData.byCategory.other, color: "#94a3b8" },
      ]
    : []

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "low":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border bg-background p-2 text-sm shadow-md">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: payload[0].payload.color }}></div>
            <span className="font-medium">{payload[0].name}</span>
          </div>
          <div className="mt-1">
            <span>Count: {payload[0].value}</span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alert Summary
        </CardTitle>
        <CardDescription>Overview of all alerts in your account</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">By Severity</h3>
                <Chart className="h-[200px]">
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={severityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {severityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <ChartLegend className="mt-4 justify-center">
                    {severityData.map((entry) => (
                      <ChartLegendItem key={entry.name} name={entry.name} color={entry.color} />
                    ))}
                  </ChartLegend>
                </Chart>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">By Category</h3>
                <Chart className="h-[200px]">
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <ChartLegend className="mt-4 justify-center">
                    {categoryData.map((entry) => (
                      <ChartLegendItem key={entry.name} name={entry.name} color={entry.color} />
                    ))}
                  </ChartLegend>
                </Chart>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-lg font-bold">{alertData.totalCount}</span>
                </div>
              </div>
              <div className="rounded-md border p-3 bg-red-50 dark:bg-red-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Critical
                  </span>
                  <span className="text-lg font-bold">{alertData.bySeverity.critical}</span>
                </div>
              </div>
              <div className="rounded-md border p-3 bg-amber-50 dark:bg-amber-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Medium
                  </span>
                  <span className="text-lg font-bold">{alertData.bySeverity.medium}</span>
                </div>
              </div>
              <div className="rounded-md border p-3 bg-blue-50 dark:bg-blue-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Info className="h-4 w-4 text-blue-500" />
                    Info
                  </span>
                  <span className="text-lg font-bold">{alertData.bySeverity.info}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
