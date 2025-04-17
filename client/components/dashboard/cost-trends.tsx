"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Chart, ChartContainer, ChartTooltip, ChartLegend, ChartLegendItem } from "../ui/chart"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Skeleton } from "../ui/skeleton"

interface CostTrendsProps {
  className?: string
}

export function CostTrends({ className }: CostTrendsProps) {
  const [loading, setLoading] = useState(true)

  // Simulating data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const dailyData = [
    { name: "Apr 1", AWS: 1400, Azure: 240, GCP: 240 },
    { name: "Apr 2", AWS: 1300, Azure: 230, GCP: 220 },
    { name: "Apr 3", AWS: 1200, Azure: 220, GCP: 250 },
    { name: "Apr 4", AWS: 1278, Azure: 272, GCP: 289 },
    { name: "Apr 5", AWS: 1189, Azure: 301, GCP: 305 },
    { name: "Apr 6", AWS: 1109, Azure: 352, GCP: 406 },
    { name: "Apr 7", AWS: 1092, Azure: 389, GCP: 387 },
    { name: "Apr 8", AWS: 1200, Azure: 394, GCP: 410 },
    { name: "Apr 9", AWS: 1108, Azure: 355, GCP: 385 },
    { name: "Apr 10", AWS: 1129, Azure: 367, GCP: 402 },
  ]

  const monthlyData = [
    { name: "Jan", AWS: 31000, Azure: 6500, GCP: 5400 },
    { name: "Feb", AWS: 28900, Azure: 6700, GCP: 5600 },
    { name: "Mar", AWS: 32300, Azure: 7100, GCP: 6100 },
    { name: "Apr", AWS: 34500, Azure: 7800, GCP: 6800 },
  ]

  const serviceData = [
    { name: "EC2", value: 4300 },
    { name: "S3", value: 2500 },
    { name: "RDS", value: 1800 },
    { name: "Lambda", value: 1200 },
    { name: "Other", value: 2600 },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Cost Trends</CardTitle>
        <CardDescription>Track your cloud spending over time across providers</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="services">By Service</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="daily" className="space-y-4">
            <div className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-[250px] w-full" />
                </div>
              ) : (
                <Chart>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={dailyData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="AWS" stackId="1" stroke="#FF9900" fill="#FF9900" />
                        <Area type="monotone" dataKey="Azure" stackId="1" stroke="#0078D4" fill="#0078D4" />
                        <Area type="monotone" dataKey="GCP" stackId="1" stroke="#4285F4" fill="#4285F4" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <ChartLegend>
                    <ChartLegendItem name="AWS" color="#FF9900" />
                    <ChartLegendItem name="Azure" color="#0078D4" />
                    <ChartLegendItem name="GCP" color="#4285F4" />
                  </ChartLegend>
                </Chart>
              )}
            </div>
          </TabsContent>
          <TabsContent value="monthly" className="space-y-4">
            <div className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-[250px] w-full" />
                </div>
              ) : (
                <Chart>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthlyData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="AWS" stackId="1" stroke="#FF9900" fill="#FF9900" />
                        <Area type="monotone" dataKey="Azure" stackId="1" stroke="#0078D4" fill="#0078D4" />
                        <Area type="monotone" dataKey="GCP" stackId="1" stroke="#4285F4" fill="#4285F4" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <ChartLegend>
                    <ChartLegendItem name="AWS" color="#FF9900" />
                    <ChartLegendItem name="Azure" color="#0078D4" />
                    <ChartLegendItem name="GCP" color="#4285F4" />
                  </ChartLegend>
                </Chart>
              )}
            </div>
          </TabsContent>
          <TabsContent value="services" className="space-y-4">
            <div className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-[250px] w-full" />
                </div>
              ) : (
                <Chart>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={serviceData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="value" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </Chart>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
