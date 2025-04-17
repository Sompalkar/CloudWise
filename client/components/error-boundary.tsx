"use client"

import * as React from "react"
// import { Button } from "@/components/ui/button"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { AlertTriangle } from "lucide-react"
// import { logError } from "@/lib/error-logger"
import { logError } from "../lib/error-logger"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in its child component tree
 * Displays a fallback UI instead of crashing the whole application
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to an error reporting service
    logError(error,  )
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="flex min-h-[400px] items-center justify-center p-8">
            <Card className="mx-auto max-w-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <CardTitle>Something went wrong</CardTitle>
                </div>
                <CardDescription>An error occurred while rendering this component</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-4">
                  <p className="font-mono text-sm text-muted-foreground">
                    {this.state.error?.message || "Unknown error"}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    this.setState({ hasError: false, error: null })
                    window.location.reload()
                  }}
                >
                  Try again
                </Button>
              </CardFooter>
            </Card>
          </div>
        )
      )
    }

    return this.props.children
  }
}
