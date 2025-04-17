"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token provided.")
      return
    }

    const verifyEmail = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/auth/verify-email/${token}`, {
        //   method: "POST",
        // })
        // const data = await response.json()

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simulate success
        setStatus("success")
        setMessage("Your email has been verified successfully. You can now log in.")

        toast({
          title: "Email verified",
          description: "Your email has been verified successfully. You can now log in.",
        })
      } catch (error) {
        setStatus("error")
        setMessage("Failed to verify email. The token may be invalid or expired.")

        toast({
          title: "Verification failed",
          description: "Failed to verify email. The token may be invalid or expired.",
          variant: "destructive",
        })
      }
    }

    verifyEmail()
  }, [token, toast])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-2">
            {status === "loading" && <Loader2 className="h-12 w-12 text-primary animate-spin" />}
            {status === "success" && <CheckCircle2 className="h-12 w-12 text-green-500" />}
            {status === "error" && <XCircle className="h-12 w-12 text-red-500" />}
          </div>
          <CardTitle className="text-center text-2xl">Email Verification</CardTitle>
          <CardDescription className="text-center">{message}</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" && <p className="text-center">Verifying your email address...</p>}
          {status === "success" && (
            <p className="text-center">
              Your email has been verified successfully. You can now log in to your account.
            </p>
          )}
          {status === "error" && (
            <p className="text-center">
              {message || "There was an error verifying your email. Please try again or contact support."}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status === "success" && (
            <Button asChild>
              <Link href="/auth/login">Log In</Link>
            </Button>
          )}
          {status === "error" && (
            <div className="flex flex-col space-y-2 w-full">
              <Button asChild>
                <Link href="/resend-verification">Resend Verification Email</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
