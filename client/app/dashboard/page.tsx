import type { Metadata } from "next"
import { DashboardOverview } from "../../components/dashboard/dashboard-overview"
import { CostTrends } from "../../components/dashboard/cost-trends"
import { TopRecommendations } from "../../components/dashboard/top-recommendations"
import { CloudAccounts } from "../../components/dashboard/cloud-accounts"
import { RecentAlerts } from "../../components/dashboard/recent-alerts"

export const metadata: Metadata = {
  title: "Dashboard | CloudWise",
  description: "Monitor and optimize your cloud costs with AI-powered insights",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="space-y-6">
        <DashboardOverview />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CostTrends className="md:col-span-2" />
          <TopRecommendations />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <CloudAccounts />
          <RecentAlerts />
        </div>
      </div>
    </div>
  )
}
