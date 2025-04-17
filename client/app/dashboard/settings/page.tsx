import type { Metadata } from "next"
import { SettingsGeneral } from "../../../components/dashboard/settings-general"
import { SettingsNotifications } from "../../../components/dashboard/settings-notifications"
import { SettingsAppearance } from "../../../components/dashboard/settings-appearance"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"

export const metadata: Metadata = {      
  title: "Settings | CloudWise",
  description: "Manage your account settings and preferences",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <SettingsGeneral />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <SettingsNotifications />
        </TabsContent>
        <TabsContent value="appearance" className="space-y-4">
          <SettingsAppearance />
        </TabsContent>
      </Tabs>
    </div>
  )
}
