import type { Metadata } from "next"
import { AlertsList } from "../../../components/dashboard/alerts-list"
import { AlertsSummary } from "../../../components/dashboard/alerts-summary"
import { AlertsFilters } from "../../../components/dashboard/alerts-filters"

export const metadata: Metadata = {
  title: "Alerts | CloudWise",
  description: "Monitor and manage alerts for your cloud resources",
}

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
      <div className="space-y-6">
        <AlertsSummary />
        <AlertsFilters />
        <AlertsList />
      </div>
    </div>
  )
}
