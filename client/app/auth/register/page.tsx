import type { Metadata } from "next"
import Link from "next/link"
// import { RegisterForm } from ".././components/auth/register-form"
import { RegisterForm } from "../../../components/auth/register-form"
import { CloudCog } from "lucide-react"

export const metadata: Metadata = {
  title: "Register | CloudWise",
  description: "Create a new CloudWise account",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex items-center space-x-2">
            <CloudCog className="h-8 w-8 text-teal-500" />
            <span className="text-2xl font-bold">CloudWise</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your details to create a new account</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <RegisterForm />
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
