/**
 * Mock user data for backend testing
 */

import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

/**
 * Generate mock users for testing
 * @param {number} count Number of users to generate
 * @returns {Array} Array of user objects
 */
export function generateMockUsers(count = 3) {
  const users = [
    {
      id: uuidv4(),
      auth0Id: "auth0|123456789",
      email: "admin@cloudwise.io",
      firstName: "Admin",
      lastName: "User",
      picture: "https://i.pravatar.cc/150?u=admin@cloudwise.io",
      role: "admin",
      password: bcrypt.hashSync("password123", 10),
      lastLogin: new Date(),
      settings: {
        theme: "light",
        notifications: {
          email: true,
          push: true,
        },
        dashboardLayout: "default",
      },
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      auth0Id: "auth0|987654321",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      picture: "https://i.pravatar.cc/150?u=john.doe@example.com",
      role: "user",
      password: bcrypt.hashSync("password123", 10),
      lastLogin: new Date(),
      settings: {
        theme: "dark",
        notifications: {
          email: true,
          push: false,
        },
        dashboardLayout: "compact",
      },
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      auth0Id: "auth0|567891234",
      email: "jane.smith@example.com",
      firstName: "Jane",
      lastName: "Smith",
      picture: "https://i.pravatar.cc/150?u=jane.smith@example.com",
      role: "user",
      password: bcrypt.hashSync("password123", 10),
      lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      settings: {
        theme: "system",
        notifications: {
          email: false,
          push: true,
        },
        dashboardLayout: "default",
      },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ]

  // Generate additional users if needed
  if (count > 3) {
    for (let i = 3; i < count; i++) {
      const firstName = `User${i}`
      const lastName = `Test${i}`
      const email = `user${i}@example.com`

      users.push({
        id: uuidv4(),
        auth0Id: `auth0|user${i}`,
        email,
        firstName,
        lastName,
        picture: `https://i.pravatar.cc/150?u=${email}`,
        role: "user",
        password: bcrypt.hashSync("password123", 10),
        lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        settings: {
          theme: ["light", "dark", "system"][Math.floor(Math.random() * 3)],
          notifications: {
            email: Math.random() > 0.5,
            push: Math.random() > 0.5,
          },
          dashboardLayout: ["default", "compact"][Math.floor(Math.random() * 2)],
        },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
      })
    }
  }

  return users
}

/**
 * Get a mock user by ID
 * @param {string} id User ID
 * @returns {Object|null} User object or null if not found
 */
export function getMockUserById(id) {
  const users = generateMockUsers()
  return users.find((user) => user.id === id) || null
}

/**
 * Get a mock user by email
 * @param {string} email User email
 * @returns {Object|null} User object or null if not found
 */
export function getMockUserByEmail(email) {
  const users = generateMockUsers()
  return users.find((user) => user.email === email) || null
}

/**
 * Get a mock user by Auth0 ID
 * @param {string} auth0Id Auth0 ID
 * @returns {Object|null} User object or null if not found
 */
export function getMockUserByAuth0Id(auth0Id) {
  const users = generateMockUsers()
  return users.find((user) => user.auth0Id === auth0Id) || null
}
