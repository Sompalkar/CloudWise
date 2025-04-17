import type { Metadata } from "next"
import { RecommendationsList } from "../../../components/dashboard/recommendations-list"
import { RecommendationsSummary } from "../../../components/dashboard/recommendations-summary"
import { RecommendationsFilters } from "../../../components/dashboard/recommendations-filters"

export const metadata: Metadata = {
  title: "Recommendations | CloudWise",
  description: "AI-powered recommendations to optimize your cloud costs",
}

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Recommendations</h1>
      <div className="space-y-6">
        <RecommendationsSummary />
        <RecommendationsFilters />
        <RecommendationsList />
      </div>
    </div>
  )
}
