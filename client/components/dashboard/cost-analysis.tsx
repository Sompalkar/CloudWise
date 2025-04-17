"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Chart, ChartContainer, ChartLegend, ChartLegendItem } from "../../components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from ../../../components/ui/select"
import { Select ,SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select"
import { Skeleton } from "../../components/ui/skeleton"
import { useToast } from "../../hooks/use-toast"

export function CostAnalysis() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")
  const [groupBy, setGroupBy] = useState("daily")
  const [costData, setCostData] = useState<any[]>([])

  useEffect(() => {
    const fetchCostData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/costs/total?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`)
        // const data = await response.json()
        // setCostData(data.data)

        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Generate mock data based on the selected time range and grouping
        const mockData = generateMockData(timeRange, groupBy)
        setCostData(mockData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load cost data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchCostData()
  }, [timeRange, groupBy, toast])

  // Generate mock data based on time range and grouping
  const generateMockData = (range: string, group: string) => {
    const data = []
    const now = new Date()
    let days = 30

    switch (range) {
      case "7d":
        days = 7
        break
      case "30d":
        days = 30
        break
      case "90d":
        days = 90
        break
      case "ytd":
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        days = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
        break
    }

    if (group === "daily") {
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        // Random values with some trend
        const awsCost = 1000 + Math.random() * 500 - i * 5
        const azureCost = 300 + Math.random() * 200 - i * 2
        const gcpCost = 200 + Math.random() * 150 - i * 1.5

        data.push({
          name: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          AWS: Math.max(0, awsCost),
          Azure: Math.max(0, azureCost),
          GCP: Math.max(0, gcpCost),
        })
      }
    } else if (group === "monthly") {
      // For monthly, we'll generate the last 12 months
      const months = Math.min(12, Math.ceil(days / 30))

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)

        // Random values with some trend
        const awsCost = 30000 + Math.random() * 15000 - i * 1000
        const azureCost = 9000 + Math.random() * 6000 - i * 400
        const gcpCost = 6000 + Math.random() * 4500 - i * 300

        data.push({
          name: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          AWS: Math.max(0, awsCost),
          Azure: Math.max(0, azureCost),
          GCP: Math.max(0, gcpCost),
        })
      }
    }

    return data
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border bg-background p-2 text-sm shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2 mt-1">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span>
                {entry.name}: {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
          <div className="mt-1 pt-1 border-t">
            <span className="font-medium">
              Total: {formatCurrency(payload.reduce((sum: number, entry: any) => sum + entry.value, 0))}
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Cost Analysis</CardTitle>
            <CardDescription>Analyze your cloud spending over time</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
              </SelectContent>
            </Select>

            <Tabs defaultValue="daily" value={groupBy} onValueChange={setGroupBy} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="h-[350px] w-full" />
            </div>
          ) : (
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={costData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="AWS" stackId="1" stroke="#FF9900" fill="#FF9900" />
                    <Area type="monotone" dataKey="Azure" stackId="1" stroke="#0078D4" fill="#0078D4" />
                    <Area type="monotone" dataKey="GCP" stackId="1" stroke="#4285F4" fill="#4285F4" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartLegend className="mt-4 justify-center">
                <ChartLegendItem name="AWS" color="#FF9900" />
                <ChartLegendItem name="Azure" color="#0078D4" />
                <ChartLegendItem name="GCP" color="#4285F4" />
              </ChartLegend>
            </Chart>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
