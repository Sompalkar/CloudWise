"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useToast } from "../../hooks/use-toast"
import { CreditCard, Lock } from "lucide-react"

interface CheckoutFormProps {
  amount: number
  currency?: string
  description?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function CheckoutForm({
  amount,
  currency = "usd",
  description = "Payment",
  onSuccess,
  onCancel,
}: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { toast } = useToast()

  const [isProcessing, setIsProcessing] = useState(false)
  const [cardholderName, setCardholderName] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      return
    }

    setIsProcessing(true)

    try {
      // In a real app, this would create a payment intent on your server
      // const response = await fetch("/api/payments/payment-intent", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ amount, currency, description }),
      // })
      // const data = await response.json()

      // Mock client secret for demo purposes
      const clientSecret = "pi_mock_client_secret"

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName,
            email,
          },
        },
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      // For demo purposes, simulate success
      toast({
        title: "Payment successful",
        description: `Your payment of ${formatAmount(amount, currency)} has been processed successfully.`,
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "An error occurred while processing your payment.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Complete your payment of {formatAmount(amount, currency)}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-element">Card Details</Label>
            <div className="p-3 border rounded-md">
              <CardElement
                id="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <Lock className="h-3 w-3 mr-1" />
              Your payment information is secure and encrypted
            </div>
          </div>

          <div className="rounded-md bg-muted p-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{formatAmount(amount, currency)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatAmount(amount, currency)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!stripe || isProcessing}>
            {isProcessing ? "Processing..." : `Pay ${formatAmount(amount, currency)}`}
            <CreditCard className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
