"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { PlusCircle, Edit, Trash, RefreshCw } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { useToast } from "../../hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

interface CloudAccount {
  id: string;
  name: string;
  provider: "aws" | "azure" | "gcp";
  status: "connected" | "error" | "pending";
  lastSync?: string;
  accountId: string;
  resources?: number;
}

export function AccountsList() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<CloudAccount[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        // In a real app, this would be API calls to fetch accounts from all providers
        // const awsResponse = await fetch('/api/aws/accounts')
        // const azureResponse = await fetch('/api/azure/accounts')
        // const gcpResponse = await fetch('/api/gcp/accounts')

        // const awsAccounts = await awsResponse.json()
        // const azureAccounts = await azureResponse.json()
        // const gcpAccounts = await gcpResponse.json()

        // const allAccounts = [...awsAccounts, ...azureAccounts, ...gcpAccounts]

        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const mockAccounts: CloudAccount[] = [
          {
            id: "aws-1",
            name: "Production AWS",
            provider: "aws",
            status: "connected",
            lastSync: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            accountId: "123456789012",
            resources: 156,
          },
          {
            id: "aws-2",
            name: "Development AWS",
            provider: "aws",
            status: "connected",
            lastSync: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            accountId: "987654321098",
            resources: 87,
          },
          {
            id: "azure-1",
            name: "Azure Production",
            provider: "azure",
            status: "connected",
            lastSync: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            accountId: "subscription-id-123",
            resources: 42,
          },
          {
            id: "gcp-1",
            name: "GCP Analytics",
            provider: "gcp",
            status: "error",
            lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            accountId: "project-id-456",
            resources: 23,
          },
        ];

        setAccounts(mockAccounts);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load cloud accounts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [toast]);

  const handleSync = async (accountId: string, provider: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/${provider}/accounts/${accountId}/sync`, {
      //   method: 'POST'
      // })

      toast({
        title: "Sync started",
        description: "Account sync has been initiated",
      });

      // Update the lastSync time in the UI
      setAccounts(
        accounts.map((account) =>
          account.id === accountId
            ? { ...account, lastSync: new Date().toISOString() }
            : account
        )
      );
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Failed to sync account",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (accountId: string, provider: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // In a real app, this would be an API call
      // await fetch(`/api/${provider}/accounts/${accountId}`, {
      //   method: 'DELETE'
      // })

      toast({
        title: "Account deleted",
        description: "Cloud account has been removed",
      });

      // Remove the account from the UI
      setAccounts(accounts.filter((account) => account.id !== accountId));
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else {
      const diffHours = Math.round(diffMins / 60);
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }
  };

  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case "aws":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
          >
            AWS
          </Badge>
        );
      case "azure":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
          >
            Azure
          </Badge>
        );
      case "gcp":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
          >
            GCP
          </Badge>
        );
      default:
        return <Badge variant="outline">{provider}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
          >
            Connected
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
          >
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cloud Accounts</CardTitle>
            <CardDescription>
              Manage your connected cloud provider accounts
            </CardDescription>
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
        ) : accounts.length > 0 ? (
          <div className="rounded-md border">
            <div className="grid grid-cols-6 gap-4 p-4 font-medium">
              <div>Account</div>
              <div>Provider</div>
              <div>Status</div>
              <div>Last Sync</div>
              <div>Resources</div>
              <div className="text-right">Actions</div>
            </div>
            {accounts.map((account) => (
              <div
                key={account.id}
                className="grid grid-cols-6 gap-4 border-t p-4 items-center"
              >
                <div className="font-medium">{account.name}</div>
                <div>{getProviderLabel(account.provider)}</div>
                <div>{getStatusBadge(account.status)}</div>
                <div className="text-muted-foreground">
                  {account.lastSync ? formatTimeAgo(account.lastSync) : "Never"}
                </div>
                <div>{account.resources || 0}</div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSync(account.id, account.provider)}
                    title="Sync account"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="sr-only">Sync</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/accounts/${account.id}`}>
                          Edit Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/accounts/${account.id}/resources`}
                        >
                          View Resources
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(account.id, account.provider)}
                    title="Delete account"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">
              No cloud accounts connected yet
            </p>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Connect Your First Account
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
