import type React from "react"
import { DashboardSidebar } from "../../components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "../../components/dashboard/dashboard-header"
import { ProtectedRoute } from "../../components/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
        <DashboardHeader />
      <div className="flex min-h-screen  ">
        <div className="flex mt-12">
          <div className=" pt-20"><DashboardSidebar  /></div>
          <main className="   bg-muted/30 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
