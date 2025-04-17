"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Chart, ChartContainer, ChartLegend, ChartLegendItem } from "../../components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Skeleton } from "../../components/ui/skeleton"
import { useToast } from "../../hooks/use-toast"

export function CostByService() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [serviceData, setServiceData] = useState<any[]>([])

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/costs/by-service')
        // const data = await response.json()
        // setServiceData(data)

        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1800))

        // Generate mock service data
        const mockData = [
          { name: "EC2", value: 4300, color: "#FF9900" },
          { name: "S3", value: 2500, color: "#FF9900" },
          { name: "RDS", value: 1800, color: "#FF9900" },
          { name: "Lambda", value: 1200, color: "#FF9900" },
          { name: "Virtual Machines", value: 3200, color: "#0078D4" },
          { name: "Storage", value: 1500, color: "#0078D4" },
          { name: "Compute Engine", value: 2800, color: "#4285F4" },
          { name: "Cloud Storage", value: 1100, color: "#4285F4" },
        ]

        setServiceData(mockData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load service cost data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchServiceData()
  }, [toast])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
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
            <span>{formatCurrency(payload[0].value)}</span>
          </div>
        </div>
      )
    }
    return null
  }

  // Get top 5 services for the pie chart
  const topServices = [...serviceData].sort((a, b) => b.value - a.value).slice(0, 5)

  // Calculate "Other" category if there are more than 5 services
  if (serviceData.length > 5) {
    const otherValue = serviceData
      .sort((a, b) => b.value - a.value)
      .slice(5)
      .reduce((sum, item) => sum + item.value, 0)

    if (otherValue > 0) {
      topServices.push({
        name: "Other",
        value: otherValue,
        color: "#94a3b8",
      })
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Cost by Service</CardTitle>
        <CardDescription>Top services by cost</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topServices}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {topServices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartLegend className="mt-4 justify-center flex-wrap">
                {topServices.map((entry) => (
                  <ChartLegendItem key={entry.name} name={entry.name} color={entry.color} />
                ))}
              </ChartLegend>
            </Chart>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
