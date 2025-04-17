import type { Metadata } from "next";
import { CostAnalysis } from "../../../components/dashboard/cost-analysis";
import { CostByService } from "../../../components/dashboard/cost-by-service";
import { CostByAccount } from "../../../components/dashboard/cost-by-account";
import { CostForecast } from "../../../components/dashboard/cost-forecast";

export const metadata: Metadata = {
  title: "Cost Analysis | CloudWise",
  description: "Analyze your cloud costs across providers and services",
};

export default function CostsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Cost Analysis</h1>
      <div className="space-y-6">
        <CostAnalysis />
        <div className="grid gap-6 md:grid-cols-2">
          <CostByService />
          <CostByAccount />
        </div>
        <CostForecast />
      </div>
    </div>
  );
}
