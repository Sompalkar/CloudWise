/**
 * Mock user data
 */

// import type { User } from "@/components/auth-provider"
import type { User } from "../components/auth-provider"

export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "admin@cloudwise.io",
    firstName: "Admin",
    lastName: "User",
    picture: "https://i.pravatar.cc/150?u=admin@cloudwise.io",
    role: "admin",
    lastLogin: new Date().toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user-2",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    picture: "https://i.pravatar.cc/150?u=john.doe@example.com",
    role: "user",
    lastLogin: new Date().toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user-3",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    picture: "https://i.pravatar.cc/150?u=jane.smith@example.com",
    role: "user",
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

/**
 * Get a mock user by ID
 */
export function getMockUser(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id)
}

/**
 * Get a mock user by email
 */
export function getMockUserByEmail(email: string): User | undefined {
  return mockUsers.find((user) => user.email === email)
}
