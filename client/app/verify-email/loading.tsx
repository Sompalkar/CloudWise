import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Loader2 } from "lucide-react"

export default function VerifyEmailLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
          <CardTitle className="text-center text-2xl">Email Verification</CardTitle>
          <CardDescription className="text-center">Verifying your email address...</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center">Please wait while we verify your email address.</p>
        </CardContent>
      </Card>
    </div>
  )
}
