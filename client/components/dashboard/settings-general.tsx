"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { useToast } from "../../hooks/use-toast"
import { useAuth } from "../../hooks/use-auth"
import { CardFooter } from "../ui/card"

export function SettingsGeneral() {
 const { user, updateProfile } = useAuth()
 const { toast } = useToast()

 const [profileData, setProfileData] = useState({
   firstName: "",
   lastName: "",
 })
 const [isSubmitting, setIsSubmitting] = useState(false)

 useEffect(() => {
   if (user) {
     setProfileData({
       firstName: user.firstName || "",
       lastName: user.lastName || "",
     })
   }
 }, [user])

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = e.target
   setProfileData((prev) => ({ ...prev, [name]: value }))
 }

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   setIsSubmitting(true)

   try {
     await updateProfile(profileData)

     toast({
       title: "Profile updated",
       description: "Your profile has been updated successfully.",
     })
   } catch (error) {
     toast({
       title: "Error",
       description: error instanceof Error ? error.message : "Failed to update profile",
       variant: "destructive",
     })
   } finally {
     setIsSubmitting(false)
   }
 }

 return (
   <Card>
     <CardHeader>
       <CardTitle>General Information</CardTitle>
       <CardDescription>Update your basic profile information</CardDescription>
     </CardHeader>
     <form onSubmit={handleSubmit}>
       <CardContent className="space-y-6">
         <div className="grid gap-4 sm:grid-cols-2">
           <div className="space-y-2">
             <Label htmlFor="firstName">First name</Label>
             <Input
               id="firstName"
               name="firstName"
               value={profileData.firstName}
               onChange={handleChange}
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="lastName">Last name</Label>
             <Input
               id="lastName"
               name="lastName"
               value={profileData.lastName}
               onChange={handleChange}
             />
           </div>
         </div>
       </CardContent>
       <CardFooter>
         <Button type="submit" disabled={isSubmitting}>
           {isSubmitting ? "Saving..." : "Save Changes"}
         </Button>
       </CardFooter>
     </form>
   </Card>
 )
}
