import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useTheme } from "next-themes"

export function SettingsAppearance() {
 const { theme, setTheme } = useTheme()

 return (
   <Card>
     <CardHeader>
       <CardTitle>Appearance</CardTitle>
       <CardDescription>Customize the look and feel of your dashboard</CardDescription>
     </CardHeader>
     <CardContent className="space-y-6">
       <div>
         <h3 className="text-lg font-medium mb-2">Theme</h3>
         <div className="space-y-2">
           <Label htmlFor="theme">Select a theme</Label>
           <Select value={theme} onValueChange={setTheme}>
             <SelectTrigger className="w-[180px]">
               <SelectValue placeholder="System" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="system">System</SelectItem>
               <SelectItem value="light">Light</SelectItem>
               <SelectItem value="dark">Dark</SelectItem>
             </SelectContent>
           </Select>
         </div>
       </div>
     </CardContent>
   </Card>
 )
}
