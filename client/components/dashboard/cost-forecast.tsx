"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Chart, ChartContainer } from "../../components/ui/chart"
import { Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ComposedChart } from "recharts"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Skeleton } from "../../components/ui/skeleton"
import { useToast } from "../../hooks/use-toast"

export function CostForecast() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [forecastData, setForecastData] = useState<any>(null)

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/costs/forecast')
        // const data = await response.json()
        // setForecastData(data)

        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Generate mock forecast data
        const mockData = {
          currentCost: 12345.67,
          projectedCost: 15890.0,
          previousMonthCost: 14500.0,
          changeAmount: 1390.0,
          changePercentage: 9.6,
          dailyAverage: 529.67,
          daysInMonth: 30,
          daysPassed: 15,
          daysRemaining: 15,
          dailyData: [
            { day: 1, actual: 520, projected: null },
            { day: 2, actual: 510, projected: null },
            { day: 3, actual: 535, projected: null },
            { day: 4, actual: 542, projected: null },
            { day: 5, actual: 518, projected: null },
            { day: 6, actual: 490, projected: null },
            { day: 7, actual: 505, projected: null },
            { day: 8, actual: 525, projected: null },
            { day: 9, actual: 540, projected: null },
            { day: 10, actual: 550, projected: null },
            { day: 11, actual: 545, projected: null },
            { day: 12, actual: 560, projected: null },
            { day: 13, actual: 530, projected: null },
            { day: 14, actual: 525, projected: null },
            { day: 15, actual: 540, projected: null },
            { day: 16, actual: null, projected: 530 },
            { day: 17, actual: null, projected: 535 },
            { day: 18, actual: null, projected: 530 },
            { day: 19, actual: null, projected: 525 },
            { day: 20, actual: null, projected: 530 },
            { day: 21, actual: null, projected: 535 },
            { day: 22, actual: null, projected: 530 },
            { day: 23, actual: null, projected: 525 },
            { day: 24, actual: null, projected: 530 },
            { day: 25, actual: null, projected: 535 },
            { day: 26, actual: null, projected: 530 },
            { day: 27, actual: null, projected: 525 },
            { day: 28, actual: null, projected: 530 },
            { day: 29, actual: null, projected: 535 },
            { day: 30, actual: null, projected: 530 },
          ],
        }

        setForecastData(mockData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load forecast data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchForecastData()
  }, [toast])

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
          <p className="font-medium">Day {label}</p>
          {payload.map((entry: any, index: number) => {
            if (entry.value !== null) {
              return (
                <div key={`item-${index}`} className="flex items-center gap-2 mt-1">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span>
                    {entry.name}: {formatCurrency(entry.value)}
                  </span>
                </div>
              )
            }
            return null
          })}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Forecast</CardTitle>
        <CardDescription>Projected spending for the current month</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">Current Spend</div>
                <div className="text-2xl font-bold">{formatCurrency(forecastData.currentCost)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {forecastData.daysPassed} of {forecastData.daysInMonth} days
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">Projected Total</div>
                <div className="text-2xl font-bold">{formatCurrency(forecastData.projectedCost)}</div>
                <div className="flex items-center text-xs mt-1">
                  {forecastData.changePercentage > 0 ? (
                    <>
                      <ArrowUpIcon className="mr-1 h-3 w-3 text-red-500" />
                      <span className="text-red-500">{forecastData.changePercentage.toFixed(1)}% from last month</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownIcon className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500">
                        {Math.abs(forecastData.changePercentage).toFixed(1)}% from last month
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">Daily Average</div>
                <div className="text-2xl font-bold">{formatCurrency(forecastData.dailyAverage)}</div>
                <div className="text-xs text-muted-foreground mt-1">{forecastData.daysRemaining} days remaining</div>
              </div>
            </div>

            <div className="h-[300px]">
              <Chart>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={forecastData.dailyData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="actual" name="Actual" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="projected" name="Projected" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="actual" stroke="#047857" dot={false} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="projected" stroke="#64748B" strokeDasharray="5 5" dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </Chart>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
