/**
 * Mock Azure account data for backend testing
 */

import { v4 as uuidv4 } from "uuid"
import { encryptData } from "../utils/encryption.js"

/**
 * Generate mock Azure accounts for testing
 * @param {Array} users Array of user objects
 * @param {number} count Number of accounts to generate per user
 * @returns {Array} Array of Azure account objects
 */
export function generateMockAzureAccounts(users, count = 1) {
  const accounts = []

  users.forEach((user) => {
    // Admin user gets more accounts
    const userAccountCount = user.role === "admin" ? count + 1 : count

    for (let i = 0; i < userAccountCount; i++) {
      const isError = Math.random() < 0.2 // 20% chance of error
      const status = isError ? "error" : "connected"
      const lastSync =
        status === "connected" ? new Date(Date.now() - Math.floor(Math.random() * 48) * 60 * 60 * 1000) : null

      accounts.push({
        id: uuidv4(),
        userId: user.id,
        name: i === 0 ? "Production Azure" : `Azure Subscription ${i + 1}`,
        tenantId: uuidv4(),
        subscriptionId: uuidv4(),
        clientId: encryptData(uuidv4()),
        clientSecret: encryptData(
          `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        ),
        status,
        lastSync,
        errorMessage: status === "error" ? "Invalid client credentials" : null,
        settings: {
          syncFrequency: "daily",
          alertThreshold: 15,
        },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
      })
    }
  })

  return accounts
}

/**
 * Get Azure accounts for a specific user
 * @param {string} userId User ID
 * @param {Array} accounts Array of Azure account objects (optional)
 * @returns {Array} Array of Azure account objects for the user
 */
export function getMockAzureAccountsByUserId(userId, accounts = null) {
  if (!accounts) {
    accounts = generateMockAzureAccounts([{ id: userId }])
  }
  return accounts.filter((account) => account.userId === userId)
}

/**
 * Get an Azure account by ID
 * @param {string} id Azure account ID
 * @param {Array} accounts Array of Azure account objects (optional)
 * @returns {Object|null} Azure account object or null if not found
 */
export function getMockAzureAccountById(id, accounts = null) {
  if (!accounts) {
    accounts = generateMockAzureAccounts([{}])
  }
  return accounts.find((account) => account.id === id) || null
}
