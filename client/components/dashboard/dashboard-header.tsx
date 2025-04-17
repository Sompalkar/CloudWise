"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../../hooks/use-auth"
import { ModeToggle } from "../mode-toggle"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Bell, ChevronDown, HelpCircle, LogOut, Search, Settings, User, CloudCog } from 'lucide-react'
import { Badge } from "../ui/badge"

export function DashboardHeader() {
 const { user, logout } = useAuth()
 const [showSearch, setShowSearch] = useState(false)

 const getInitials = (name = "") => {
   return name
     .split(" ")
     .map((n) => n[0])
     .join("")
     .toUpperCase()
 }

 // Extract user information with fallbacks
 const firstName = user?.firstName || user?.name?.split(" ")[0] || "User"
 const fullName = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User"
 const email = user?.email || ""

 return (
   <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
     <div className="flex flex-1 items-center gap-4">
       {showSearch ? (
         <div className="relative flex-1 md:max-w-sm">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input
             type="search"
             placeholder="Search..."
             className="w-full bg-background pl-8 md:w-[300px]"
             autoFocus
             onBlur={() => setShowSearch(false)}
           />
         </div>
       ) : (
         <Button variant="outline" size="icon" className="h-8 w-8 md:hidden" onClick={() => setShowSearch(true)}>
           <Search className="h-4 w-4" />
           <span className="sr-only">Search</span>
         </Button>
       )}
       <div className="hidden md:flex md:flex-1 md:items-center md:gap-4">
         <Link href="/" className="flex items-center space-x-2">
           <CloudCog className="h-6 w-6 text-teal-500" />
           <span className="text-xl font-bold">CloudWise</span>
         </Link>
         <div className="relative">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input type="search" placeholder="Search..." className="w-[300px] bg-background pl-8" />
         </div>
       </div>
     </div>
     <div className="flex items-center gap-2">
       <Button variant="outline" size="icon" className="h-8 w-8 relative" asChild>
         <Link href="/dashboard/alerts">
           <Bell className="h-4 w-4" />
           <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
             3
           </Badge>
           <span className="sr-only">Notifications</span>
         </Link>
       </Button>
       <Button variant="outline" size="icon" className="h-8 w-8" asChild>
         <Link href="/dashboard/help">
           <HelpCircle className="h-4 w-4" />
           <span className="sr-only">Help</span>
         </Link>
       </Button>
       <ModeToggle />
       <DropdownMenu>
         <DropdownMenuTrigger asChild>
           <Button variant="outline" size="sm" className="h-8 gap-1">
             <Avatar className="h-6 w-6">
               <AvatarImage src={user?.profilePicture || user?.picture || "/placeholder.svg"} alt={fullName} />
               <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
             </Avatar>
             <span className="hidden md:inline-flex">{firstName}</span>
             <ChevronDown className="h-4 w-4" />
           </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
           <DropdownMenuLabel>My Account</DropdownMenuLabel>
           <DropdownMenuSeparator />
           <DropdownMenuItem asChild>
             <Link href="/profile">
               <User className="mr-2 h-4 w-4" />
               <span>Profile</span>
             </Link>
           </DropdownMenuItem>
           <DropdownMenuItem asChild>
             <Link href="/dashboard/settings">
               <Settings className="mr-2 h-4 w-4" />
               <span>Settings</span>
             </Link>
           </DropdownMenuItem>
           <DropdownMenuSeparator />
           <DropdownMenuItem onClick={() => logout()}>
             <LogOut className="mr-2 h-4 w-4" />
             <span>Log out</span>
           </DropdownMenuItem>
         </DropdownMenuContent>
       </DropdownMenu>
     </div>
   </header>
 )
}
