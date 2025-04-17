"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { PlusCircle } from "lucide-react"
import { Skeleton } from "../ui/skeleton"

export function CloudAccounts() {
  const [loading, setLoading] = useState(true)

  // Simulating data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const accounts = [
    {
      id: 1,
      name: "Production AWS",
      provider: "aws",
      status: "connected",
      lastSync: "10 minutes ago",
      resources: 156,
    },
    {
      id: 2,
      name: "Development AWS",
      provider: "aws",
      status: "connected",
      lastSync: "25 minutes ago",
      resources: 87,
    },
    {
      id: 3,
      name: "Azure Production",
      provider: "azure",
      status: "connected",
      lastSync: "15 minutes ago",
      resources: 42,
    },
    {
      id: 4,
      name: "GCP Analytics",
      provider: "gcp",
      status: "error",
      lastSync: "Failed 2 hours ago",
      resources: 23,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Connected Cloud Accounts</CardTitle>
            <CardDescription>Manage your connected cloud provider accounts</CardDescription>
          </div>
          <Button className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Account
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="grid grid-cols-5 gap-4 p-4 font-medium">
              <div>Account</div>
              <div>Provider</div>
              <div>Status</div>
              <div>Last Sync</div>
              <div>Resources</div>
            </div>
            {accounts.map((account) => (
              <div key={account.id} className="grid grid-cols-5 gap-4 border-t p-4 items-center">
                <div className="font-medium">{account.name}</div>
                <div>
                  <Badge variant="outline" className="capitalize">
                    {account.provider}
                  </Badge>
                </div>
                <div>
                  <Badge variant={account.status === "connected" ? "success" : "destructive"} className="capitalize">
                    {account.status}
                  </Badge>
                </div>
                <div className="text-muted-foreground">{account.lastSync}</div>
                <div>{account.resources}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
