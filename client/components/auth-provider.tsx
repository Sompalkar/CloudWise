"use client"

import type * as React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "../hooks/use-toast"
// import { api } from "@/lib/api"
import { api } from "../lib/api"

// Define the User type based on our backend model
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  picture?: string
  role: "admin" | "user"
  lastLogin?: string
  createdAt: string
  updatedAt: string
  profilePicture?: string
}

// Define the AuthContext interface
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>
  logout: () => void
  updateProfile: (data: { firstName?: string; lastName?: string; profilePicture?: string }) => Promise<void>
  error: string | null
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  error: null,
})

/**
 * Auth Provider component that wraps the application to provide authentication context
 *
 * @param children - React children components
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the token with your backend
        const token = localStorage.getItem("auth_token")

        if (token) {
          // For demo purposes, we'll use a mock user
          // In production, you would fetch the user profile from your API
          const mockUser: User = JSON.parse(localStorage.getItem("user") || "null")

          if (mockUser) {
            // Ensure the user has a name property
            if (!mockUser.name && (mockUser.firstName || mockUser.lastName)) {
              mockUser.name = `${mockUser.firstName || ""} ${mockUser.lastName || ""}`.trim()
            }

            setUser(mockUser)
          } else {
            // If we have a token but no user, try to fetch the user
            await fetchUserProfile(token)
          }
        }
      } catch (err) {
        console.error("Authentication error:", err)
        setError("Failed to authenticate")
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  /**
   * Fetch user profile from the API
   */
  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()

        // Ensure the user has a name property
        if (!userData.name && (userData.firstName || userData.lastName)) {
          userData.name = `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
        }

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
      } else {
        throw new Error("Failed to fetch user profile")
      }
    } catch (err) {
      console.error("Error fetching user profile:", err)
      setError("Failed to fetch user profile")
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
    }
  }

  /**
   * Login function
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const data: any = await api.auth.login(email, password)

      localStorage.setItem("auth_token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.firstName}!`,
      })

      router.push("/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Login failed")

      toast({
        title: "Login failed",
        description: err instanceof Error ? err.message : "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Register function
   */
  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const data: any = await api.auth.register(email, password, firstName, lastName)

      toast({
        title: "Registration successful",
        description: "Your account has been created. Please check your email to verify your account.",
      })

      router.push("/auth/login")
    } catch (err) {
      console.error("Registration error:", err)
      setError(err instanceof Error ? err.message : "Registration failed")

      toast({
        title: "Registration failed",
        description: err instanceof Error ? err.message : "Could not create account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Logout function
   */
  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    setUser(null)

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })

    router.push("/")
  }

  /**
   * Update profile function
   */
  const updateProfile = async (data: { firstName?: string; lastName?: string; profilePicture?: string }) => {
    setIsLoading(true)
    setError(null)

    try {
      const response: any = await api.auth.updateProfile(data)

      localStorage.setItem("user", JSON.stringify(response))
      setUser(response)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (err) {
      console.error("Update profile error:", err)
      setError(err instanceof Error ? err.message : "Failed to update profile")

      toast({
        title: "Update profile failed",
        description: err instanceof Error ? err.message : "Could not update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
