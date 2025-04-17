/**
 * Error logging utility for client-side errors
 * In a production environment, this would send errors to a service like Sentry
 */

interface ErrorInfo {
    componentStack: string
  }
  
  /**
   * Log an error to the console and optionally to an error tracking service
   *
   * @param error - The error object
   * @param errorInfo - Additional information about the error
   */
  export function logError(error: Error, errorInfo?: ErrorInfo): void {
    // Log to console in development
    console.error("Error caught by ErrorBoundary:", error)
  
    if (errorInfo) {
      console.error("Component stack:", errorInfo.componentStack)
    }
  
    // In production, you would send this to an error tracking service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to a hypothetical error tracking service
      // errorTrackingService.captureException(error, { extra: errorInfo })
  
      // For now, just log to console with a note
      console.info("In production, this error would be sent to an error tracking service")
    }
  }
  
  /**
   * Log an API error
   *
   * @param endpoint - The API endpoint that was called
   * @param error - The error object
   */
  export function logApiError(endpoint: string, error: any): void {
    console.error(`API Error (${endpoint}):`, error)
  
    // In production, you would send this to an error tracking service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to a hypothetical error tracking service
      // errorTrackingService.captureException(error, {
      //   tags: { type: 'api' },
      //   extra: { endpoint }
      // })
    }
  }
  
  /**
   * Log a user action for debugging purposes
   *
   * @param action - The action being performed
   * @param details - Additional details about the action
   */
  export function logUserAction(action: string, details?: Record<string, any>): void {
    if (process.env.NODE_ENV !== "production") {
      console.log(`User Action: ${action}`, details || "")
    }
  }
  