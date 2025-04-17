"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { StripeProvider } from "../../components/payment/stripe-provider"
import { CheckoutForm } from "../../components/payment/checkout-form"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [planDetails, setPlanDetails] = useState<{
    name: string
    price: number
    billing: string
  } | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const plan = searchParams.get("plan")
    const billing = searchParams.get("billing") || "monthly"

    if (!plan) {
      toast({
        title: "Error",
        description: "No plan selected",
        variant: "destructive",
      })
      router.push("/pricing")
      return
    }

    // In a real app, this would fetch plan details from the API
    // For demo purposes, we'll use hardcoded values
    const getPlanDetails = () => {
      switch (plan) {
        case "price_starter":
          return {
            name: "Starter",
            price: billing === "annual" ? 49 : 59,
            billing,
          }
        case "price_professional":
          return {
            name: "Professional",
            price: billing === "annual" ? 99 : 119,
            billing,
          }
        default:
          return null
      }
    }

    const details = getPlanDetails()
    setPlanDetails(details)
    setIsLoading(false)

    if (!details) {
      toast({
        title: "Error",
        description: "Invalid plan selected",
        variant: "destructive",
      })
      router.push("/pricing")
    }
  }, [searchParams, router, toast])

  const handleCancel = () => {
    router.push("/pricing")
  }

  const handleSuccess = () => {
    router.push("/dashboard/billing")
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-10 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!planDetails) {
    return (
      <div className="container max-w-4xl py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Plan Not Found</h1>
          <p className="mb-6">The selected plan could not be found.</p>
          <Button asChild>
            <Link href="/pricing">View Plans</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/pricing" className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Pricing
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold mb-4">Checkout</h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{planDetails.name} Plan</h2>
            <p className="text-muted-foreground">
              {planDetails.billing === "annual" ? "Annual billing" : "Monthly billing"}
            </p>
          </div>

          <div className="rounded-md border p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span>{planDetails.name} Plan</span>
              <span>
                ${planDetails.price}.00/{planDetails.billing === "annual" ? "year" : "month"}
              </span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>${planDetails.price}.00</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-muted-foreground mb-6">
            <ShieldCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <p>
              Your subscription will begin immediately. You can cancel at any time from your account settings.
              {planDetails.billing === "annual" && " Annual plans are billed for the full year upfront."}
            </p>
          </div>
        </div>

        <div>
          <StripeProvider>
            <CheckoutForm
              amount={planDetails.price}
              currency="usd"
              description={`CloudWise ${planDetails.name} Plan - ${planDetails.billing === "annual" ? "Annual" : "Monthly"}`}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </StripeProvider>
        </div>
      </div>
    </div>
  )
}
