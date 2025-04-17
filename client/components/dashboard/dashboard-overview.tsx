"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Server, Clock, AlertTriangle } from "lucide-react"
import { Skeleton } from "../../components/ui/skeleton"
import { api } from "../../lib/api"
import { formatCurrency } from "../../lib/utils"
import { useToast } from "../../hooks/use-toast"

interface DashboardOverviewCard {
  title: string
  value: string | number
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
}

export function DashboardOverview() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [cardsData, setCardsData] = useState<DashboardOverviewCard[] | null>(null)

  // Define static fallback data, matching the old version
  const staticCards: DashboardOverviewCard[] = [
    {
      title: "Total Spend (MTD)",
      value: "$12,345.67",
      change: "+5.2%",
      changeType: "negative",
      icon: DollarSign,
      color: "text-primary",
    },
    {
      title: "Projected Monthly",
      value: "$15,890.00",
      change: "+3.1%",
      changeType: "negative",
      icon: Clock,
      color: "text-blue-500",
    },
    {
      title: "Active Resources",
      value: "243",
      change: "+12",
      changeType: "neutral",
      icon: Server,
      color: "text-indigo-500",
    },
    {
      title: "Optimization Alerts",
      value: "17",
      change: "-3",
      changeType: "positive",
      icon: AlertTriangle,
      color: "text-amber-500",
    },
  ]

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch cost forecast data
        const forecastData = await api.costs.getForecast()

        // Fetch total cost data
        const totalCostData = await api.costs.getTotal()

        // Mock resource and alert counts (these are already hardcoded)
        const activeResources = 243
        const optimizationAlerts = 17

        // Create cards data using fetched and hardcoded values
        const cards: DashboardOverviewCard[] = [
          {
            title: "Total Spend (MTD)",
            value: formatCurrency(totalCostData.totalCost),
            change: `${forecastData.changePercentage > 0 ? "+" : ""}${forecastData.changePercentage.toFixed(1)}%`,
            changeType: forecastData.changePercentage > 0 ? "negative" : "positive",
            icon: DollarSign,
            color: "text-primary",
          },
          {
            title: "Projected Monthly",
            value: formatCurrency(forecastData.projectedCost),
            change: `${forecastData.changePercentage > 0 ? "+" : ""}${forecastData.changePercentage.toFixed(1)}%`,
            changeType: forecastData.changePercentage > 0 ? "negative" : "positive",
            icon: Clock,
            color: "text-blue-500",
          },
          {
            title: "Active Resources",
            value: activeResources.toString(),
            change: "+12",
            changeType: "neutral",
            icon: Server,
            color: "text-indigo-500",
          },
          {
            title: "Optimization Alerts",
            value: optimizationAlerts.toString(),
            change: "-3",
            changeType: "positive",
            icon: AlertTriangle,
            color: "text-amber-500",
          },
        ]

        setCardsData(cards)
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to load dashboard data. Using fallback data.",
          variant: "destructive",
        })
        setCardsData(staticCards) // Use static data as fallback
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {loading ? (
        // Skeleton loading state
        Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-24 mb-1" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))
      ) : cardsData ? (
        // Render cards (either fetched or fallback)
        cardsData.map((card, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {card.changeType === "positive" ? (
                  <ArrowDownIcon className="mr-1 h-4 w-4 text-green-500" />
                ) : card.changeType === "negative" ? (
                  <ArrowUpIcon className="mr-1 h-4 w-4 text-red-500" />
                ) : null}
                <span
                  className={
                    card.changeType === "positive"
                      ? "text-green-500"
                      : card.changeType === "negative"
                        ? "text-red-500"
                        : ""
                  }
                >
                  {card.change} from last month
                </span>
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        // This won't be reached since cardsData is always set
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error</CardTitle>
          </CardHeader>
          <CardContent>Failed to load dashboard data.</CardContent>
        </Card>
      )}
    </div>
  )
}