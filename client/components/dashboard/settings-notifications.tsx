import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"

export function SettingsNotifications() {
 return (
   <Card>
     <CardHeader>
       <CardTitle>Notification Preferences</CardTitle>
       <CardDescription>Manage your email and push notification settings</CardDescription>
     </CardHeader>
     <CardContent className="space-y-6">
       <div>
         <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
         <div className="space-y-2">
           <div className="flex items-center justify-between">
             <Label htmlFor="marketing-emails">Marketing emails</Label>
             <input
               type="checkbox"
               id="marketing-emails"
               className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
             />
           </div>
           <div className="flex items-center justify-between">
             <Label htmlFor="product-updates">Product updates</Label>
             <input
               type="checkbox"
               id="product-updates"
               className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
               defaultChecked
             />
           </div>
           <div className="flex items-center justify-between">
             <Label htmlFor="security-alerts">Security alerts</Label>
             <input
               type="checkbox"
               id="security-alerts"
               className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
               defaultChecked
             />
           </div>
         </div>
       </div>

       <div>
         <h3 className="text-lg font-medium mb-2">Push Notifications</h3>
         <p className="text-sm text-muted-foreground">
           Push notifications are not yet implemented. Stay tuned for updates!
         </p>
       </div>
     </CardContent>
     <CardFooter>
       <Button disabled>Save Changes</Button>
     </CardFooter>
   </Card>
 )
}
