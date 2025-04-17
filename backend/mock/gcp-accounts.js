/**
 * Mock GCP account data for backend testing
 */

import { v4 as uuidv4 } from "uuid"
import { encryptData } from "../utils/encryption.js"

/**
 * Generate mock GCP accounts for testing
 * @param {Array} users Array of user objects
 * @param {number} count Number of accounts to generate per user
 * @returns {Array} Array of GCP account objects
 */
export function generateMockGcpAccounts(users, count = 1) {
  const accounts = []

  users.forEach((user) => {
    // Admin user gets more accounts
    const userAccountCount = user.role === "admin" ? count + 1 : count

    for (let i = 0; i < userAccountCount; i++) {
      const projectId = `cloudwise-${["prod", "dev", "test", "analytics"][i % 4]}-${Math.floor(100000 + Math.random() * 900000)}`
      const isError = Math.random() < 0.2 // 20% chance of error
      const status = isError ? "error" : "connected"
      const lastSync =
        status === "connected" ? new Date(Date.now() - Math.floor(Math.random() * 48) * 60 * 60 * 1000) : null

      // Mock service account key (simplified)
      const serviceAccountKey = {
        type: "service_account",
        project_id: projectId,
        private_key_id: uuidv4(),
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7VJTUt9Us8cKj\nMzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvu\nNMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZ\n-----END PRIVATE KEY-----\n",
        client_email: `cloudwise-service@${projectId}.iam.gserviceaccount.com`,
        client_id: Math.floor(100000000000000000000 + Math.random() * 900000000000000000000).toString(),
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/cloudwise-service%40${projectId}.iam.gserviceaccount.com`,
      }

      accounts.push({
        id: uuidv4(),
        userId: user.id,
        name: i === 0 ? "Production GCP" : `GCP Project ${i + 1}`,
        projectId,
        serviceAccountKey: encryptData(JSON.stringify(serviceAccountKey)),
        status,
        lastSync,
        errorMessage: status === "error" ? "Service account key is invalid" : null,
        settings: {
          syncFrequency: "daily",
          alertThreshold: 20,
        },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
      })
    }
  })

  return accounts
}

/**
 * Get GCP accounts for a specific user
 * @param {string} userId User ID
 * @param {Array} accounts Array of GCP account objects (optional)
 * @returns {Array} Array of GCP account objects for the user
 */
export function getMockGcpAccountsByUserId(userId, accounts = null) {
  if (!accounts) {
    accounts = generateMockGcpAccounts([{ id: userId }])
  }
  return accounts.filter((account) => account.userId === userId)
}

/**
 * Get a GCP account by ID
 * @param {string} id GCP account ID
 * @param {Array} accounts Array of GCP account objects (optional)
 * @returns {Object|null} GCP account object or null if not found
 */
export function getMockGcpAccountById(id, accounts = null) {
  if (!accounts) {
    accounts = generateMockGcpAccounts([{}])
  }
  return accounts.find((account) => account.id === id) || null
}
