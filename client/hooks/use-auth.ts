"use client"

import { useContext } from "react"
import { AuthContext } from "../components/auth-provider"

/**
 * Custom hook to use the auth context
 * This is a convenience wrapper around useContext(AuthContext)
 *
 * @returns The auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
