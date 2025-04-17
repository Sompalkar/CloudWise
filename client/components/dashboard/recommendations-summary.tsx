"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Chart, ChartContainer, ChartLegend, ChartLegendItem } from "../../components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Skeleton } from "../../components/ui/skeleton"
import { Lightbulb, DollarSign, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

export function RecommendationsSummary() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/recommendations/summary')
        // const data = await response.json()
        // setSummary(data)

        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1200))
        setSummary({
          totalCount: 18,
          openCount: 10,
          implementedCount: 5,
          dismissedCount: 3,
          totalPotentialSavings: 2450.75,
          implementedSavings: 850.25,
          byType: {
            rightsizing: { count: 6, savings: 950.5 },
            termination: { count: 4, savings: 650.25 },
            storage: { count: 3, savings: 250.0 },
            reservation: { count: 3, savings: 450.0 },
            network: { count: 2, savings: 150.0 },
          },
          byProvider: {
            aws: { count: 10, savings: 1500.5 },
            azure: { count: 5, savings: 650.25 },
            gcp: { count: 3, savings: 300.0 },
          },
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load recommendation summary",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [toast])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Prepare data for charts
  const typeData = summary
    ? Object.entries(summary.byType).map(([key, value]: [string, any]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: value.count,
        savings: value.savings,
        color: getTypeColor(key),
      }))
    : []

  const providerData = summary
    ? Object.entries(summary.byProvider).map(([key, value]: [string, any]) => ({
        name: key.toUpperCase(),
        value: value.count,
        savings: value.savings,
        color: getProviderColor(key),
      }))
    : []

  function getTypeColor(type: string) {
    switch (type) {
      case "rightsizing":
        return "#10B981" // green
      case "termination":
        return "#EF4444" // red
      case "storage":
        return "#3B82F6" // blue
      case "reservation":
        return "#8B5CF6" // purple
      case "network":
        return "#F59E0B" // amber
      default:
        return "#6B7280" // gray
    }
  }

  function getProviderColor(provider: string) {
    switch (provider) {
      case "aws":
        return "#FF9900" // AWS orange
      case "azure":
        return "#0078D4" // Azure blue
      case "gcp":
        return "#4285F4" // GCP blue
      default:
        return "#6B7280" // gray
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
            <div>Count: {payload[0].value}</div>
            <div>Savings: {formatCurrency(payload[0].payload.savings)}</div>
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
          <Lightbulb className="h-5 w-5 text-primary" />
          Recommendations Summary
        </CardTitle>
        <CardDescription>Overview of cost-saving opportunities</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <DollarSign className="h-8 w-8 text-primary mb-2" />
                    <div className="text-2xl font-bold">{formatCurrency(summary.totalPotentialSavings)}</div>
                    <p className="text-sm text-muted-foreground">Potential Monthly Savings</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <Lightbulb className="h-8 w-8 text-amber-500 mb-2" />
                    <div className="text-2xl font-bold">{summary.totalCount}</div>
                    <p className="text-sm text-muted-foreground">Total Recommendations</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                    <div className="text-2xl font-bold">{summary.implementedCount}</div>
                    <p className="text-sm text-muted-foreground">Implemented</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <XCircle className="h-8 w-8 text-muted-foreground mb-2" />
                    <div className="text-2xl font-bold">{summary.openCount}</div>
                    <p className="text-sm text-muted-foreground">Open</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">By Recommendation Type</h3>
                <Chart className="h-[250px]">
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={typeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {typeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <ChartLegend className="mt-4 justify-center">
                    {typeData.map((entry) => (
                      <ChartLegendItem key={entry.name} name={entry.name} color={entry.color} />
                    ))}
                  </ChartLegend>
                </Chart>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">By Cloud Provider</h3>
                <Chart className="h-[250px]">
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={providerData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {providerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <ChartLegend className="mt-4 justify-center">
                    {providerData.map((entry) => (
                      <ChartLegendItem key={entry.name} name={entry.name} color={entry.color} />
                    ))}
                  </ChartLegend>
                </Chart>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="text-sm font-medium mb-2">Implemented Savings</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.implementedSavings)}</p>
                  <p className="text-sm text-muted-foreground">Monthly savings from implemented recommendations</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {Math.round((summary.implementedSavings / summary.totalPotentialSavings) * 100)}% of potential
                  </p>
                  <div className="w-32 h-2 bg-muted rounded-full mt-1">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{
                        width: `${Math.round((summary.implementedSavings / summary.totalPotentialSavings) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
