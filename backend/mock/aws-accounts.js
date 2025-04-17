/**
 * Mock AWS account data for backend testing
 */

import { v4 as uuidv4 } from "uuid"
import { encryptData } from "../utils/encryption.js"

/**
 * Generate mock AWS accounts for testing
 * @param {Array} users Array of user objects
 * @param {number} count Number of accounts to generate per user
 * @returns {Array} Array of AWS account objects
 */
export function generateMockAwsAccounts(users, count = 2) {
  const accounts = []

  users.forEach((user) => {
    // Admin user gets more accounts
    const userAccountCount = user.role === "admin" ? count + 1 : count

    for (let i = 0; i < userAccountCount; i++) {
      const accountNumber = Math.floor(100000000000 + Math.random() * 900000000000)
      const isError = Math.random() < 0.2 // 20% chance of error
      const status = isError ? "error" : "connected"
      const lastSync =
        status === "connected" ? new Date(Date.now() - Math.floor(Math.random() * 48) * 60 * 60 * 1000) : null

      accounts.push({
        id: uuidv4(),
        userId: user.id,
        name: i === 0 ? "Production AWS" : i === 1 ? "Development AWS" : `AWS Account ${i + 1}`,
        accountId: accountNumber.toString(),
        roleArn: `arn:aws:iam::${accountNumber}:role/CloudWiseRole`,
        externalId: Math.random().toString(36).substring(2, 15),
        accessKeyId: encryptData(`AKIA${Math.random().toString(36).substring(2, 10).toUpperCase()}`),
        secretAccessKey: encryptData(
          `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        ),
        region: ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"][Math.floor(Math.random() * 4)],
        status,
        lastSync,
        errorMessage: status === "error" ? "Failed to assume role: Access denied" : null,
        settings: {
          syncFrequency: "daily",
          alertThreshold: 10,
        },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
      })
    }
  })

  return accounts
}

/**
 * Get AWS accounts for a specific user
 * @param {string} userId User ID
 * @param {Array} accounts Array of AWS account objects (optional)
 * @returns {Array} Array of AWS account objects for the user
 */
export function getMockAwsAccountsByUserId(userId, accounts = null) {
  if (!accounts) {
    accounts = generateMockAwsAccounts([{ id: userId }])
  }
  return accounts.filter((account) => account.userId === userId)
}

/**
 * Get an AWS account by ID
 * @param {string} id AWS account ID
 * @param {Array} accounts Array of AWS account objects (optional)
 * @returns {Object|null} AWS account object or null if not found
 */
export function getMockAwsAccountById(id, accounts = null) {
  if (!accounts) {
    accounts = generateMockAwsAccounts([{}])
  }
  return accounts.find((account) => account.id === id) || null
}
