"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { useToast } from "../../../hooks/use-toast"
import { CreditCard, Download, AlertCircle } from "lucide-react"

export default function BillingPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        // In a real app, this would be API calls
        // const subscriptionResponse = await fetch("/api/payments/subscriptions")
        // const subscriptionData = await subscriptionResponse.json()
        // setSubscription(subscriptionData[0])

        // const paymentsResponse = await fetch("/api/payments/payments")
        // const paymentsData = await paymentsResponse.json()
        // setPayments(paymentsData)

        // Mock data
        setSubscription({
          id: "sub_123456",
          plan: "professional",
          status: "active",
          currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
        })

        setPayments([
          {
            id: "pay_123456",
            amount: 99,
            currency: "usd",
            status: "succeeded",
            description: "CloudWise Professional Plan - Monthly",
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "pay_123457",
            amount: 99,
            currency: "usd",
            status: "succeeded",
            description: "CloudWise Professional Plan - Monthly",
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ])
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load billing information",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBillingData()
  }, [toast])

  const handleCancelSubscription = async () => {
    if (!subscription) return

    try {
      // In a real app, this would be an API call
      // await fetch(`/api/payments/subscription/${subscription.id}/cancel`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ cancelImmediately: false }),
      // })

      toast({
        title: "Subscription canceled",
        description: "Your subscription will be canceled at the end of the billing period",
      })

      // Update subscription state
      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "starter":
        return "Starter"
      case "professional":
        return "Professional"
      case "enterprise":
        return "Enterprise"
      default:
        return plan.charAt(0).toUpperCase() + plan.slice(1)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
              <CardDescription>Please wait while we load your billing information.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your subscription and payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {subscription ? (
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h3 className="font-medium">{getPlanName(subscription.plan)} Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        {subscription.status === "active" ? "Active" : subscription.status}
                        {subscription.cancelAtPeriodEnd && " (Cancels at end of billing period)"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Current period: {formatDate(subscription.currentPeriodStart)} to{" "}
                        {formatDate(subscription.currentPeriodEnd)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" asChild>
                        <Link href="/pricing">Change Plan</Link>
                      </Button>
                      {subscription.status === "active" && !subscription.cancelAtPeriodEnd && (
                        <Button variant="outline" onClick={handleCancelSubscription}>
                          Cancel Plan
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                  <div className="rounded-md border p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-6 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">No Active Subscription</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have an active subscription. Choose a plan to get started.
                </p>
                <Button asChild>
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>View your past invoices and payment history</CardDescription>
          </CardHeader>
          <CardContent>
            {payments.length > 0 ? (
              <div className="rounded-md border">
                {payments.map((payment, index) => (
                  <div key={payment.id} className={`p-4 ${index < payments.length - 1 ? "border-b" : ""}`}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(payment.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{formatAmount(payment.amount, payment.currency)}</p>
                          <p className="text-sm text-green-600 capitalize">{payment.status}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download invoice</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-6 text-center">
                <p className="text-muted-foreground">No billing history available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
