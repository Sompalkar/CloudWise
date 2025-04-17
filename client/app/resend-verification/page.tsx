"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { useToast } from "../../hooks/use-toast"
import { CloudCog, Mail, ArrowLeft } from "lucide-react"

export default function ResendVerificationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      // await fetch("/api/auth/resend-verification", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSuccess(true)
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send verification email",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex items-center space-x-2">
            <CloudCog className="h-8 w-8 text-teal-500" />
            <span className="text-2xl font-bold">CloudWise</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Resend Verification Email</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a new verification link
          </p>
        </div>

        <Card>
          <CardHeader>
            <Button variant="ghost" size="sm" asChild className="absolute left-4 top-4 p-0 h-auto">
              <Link href="/auth/login" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to login</span>
              </Link>
            </Button>
            <CardTitle>Resend Verification Email</CardTitle>
            <CardDescription>
              {isSuccess
                ? "Verification email sent! Please check your inbox."
                : "Enter your email address below to receive a new verification link."}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <Mail className="h-12 w-12 text-primary mb-4" />
                  <p className="text-center">
                    We've sent a verification email to <strong>{email}</strong>. Please check your inbox and follow the
                    instructions to verify your account.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {isSuccess ? (
                <Button asChild className="w-full">
                  <Link href="/auth/login">Back to Login</Link>
                </Button>
              ) : (
                <>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Verification Email"}
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/auth/login">Back to Login</Link>
                  </Button>
                </>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
