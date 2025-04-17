"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Chart, ChartContainer } from "../../components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"
import { Badge } from "../../components/ui/badge"
import { Skeleton } from "../../components/ui/skeleton"
import { useToast } from "../../hooks/use-toast"

export function CostByAccount() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [accountData, setAccountData] = useState<any[]>([])

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/costs/by-account')
        // const data = await response.json()
        // setAccountData(data.accounts)

        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1600))

        // Generate mock account data
        const mockData = [
          {
            id: "aws-1",
            name: "Production AWS",
            provider: "aws",
            accountId: "123456789012",
            cost: 8500,
          },
          {
            id: "aws-2",
            name: "Development AWS",
            provider: "aws",
            accountId: "987654321098",
            cost: 3200,
          },
          {
            id: "azure-1",
            name: "Azure Production",
            provider: "azure",
            accountId: "subscription-id-123",
            cost: 4700,
          },
          {
            id: "gcp-1",
            name: "GCP Analytics",
            provider: "gcp",
            accountId: "project-id-456",
            cost: 3900,
          },
        ]

        setAccountData(mockData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load account cost data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAccountData()
  }, [toast])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "aws":
        return "#FF9900"
      case "azure":
        return "#0078D4"
      case "gcp":
        return "#4285F4"
      default:
        return "#94a3b8"
    }
  }

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case "aws":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
            AWS
          </Badge>
        )
      case "azure":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
            Azure
          </Badge>
        )
      case "gcp":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400">
            GCP
          </Badge>
        )
      default:
        return <Badge variant="outline">{provider}</Badge>
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-md border bg-background p-2 text-sm shadow-md">
          <div className="flex items-center justify-between gap-4 mb-1">
            <span className="font-medium">{data.name}</span>
            {getProviderBadge(data.provider)}
          </div>
          <div className="text-muted-foreground text-xs mb-1">ID: {data.accountId}</div>
          <div className="font-medium">Cost: {formatCurrency(data.cost)}</div>
        </div>
      )
    }
    return null
  }

  // Sort accounts by cost (descending)
  const sortedAccounts = [...accountData].sort((a, b) => b.cost - a.cost)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Cost by Account</CardTitle>
        <CardDescription>Cloud accounts ranked by cost</CardDescription>
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
                  <BarChart
                    data={sortedAccounts}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickFormatter={(value) => `$${value.toLocaleString()}`} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={150}
                      tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                      {sortedAccounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getProviderColor(entry.provider)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Chart>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
