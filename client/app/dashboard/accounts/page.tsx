import type { Metadata } from "next";
// import { AccountsList } from "@/components/dashboard/accounts-list"
import { AccountsList } from "../../../components/dashboard/accounts-list";
import { AccountsHeader } from "../../../components/dashboard/accounts-header";

export const metadata: Metadata = {
  title: "Cloud Accounts | CloudWise",
  description: "Manage your connected cloud provider accounts",
};

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Cloud Accounts</h1>
      <div className="space-y-6">
        <AccountsHeader />
        <AccountsList />
      </div>
    </div>
  );
}
