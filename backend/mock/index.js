/**
 * Mock data index file for backend testing
 * Exports all mock data generators for easy access
 */

import { generateMockUsers } from "./users.js"
import { generateMockAwsAccounts } from "./aws-accounts.js"
import { generateMockAzureAccounts } from "./azure-accounts.js"
import { generateMockGcpAccounts } from "./gcp-accounts.js"
import { generateMockCostData } from "./cost-data.js"
import { generateMockResources } from "./resources.js"
import { generateMockRecommendations } from "./recommendations.js"
import { generateMockAlerts } from "./alerts.js"

/**
 * Generate all mock data for testing
 * @returns {Object} Object containing all mock data
 */
export function generateAllMockData() {
  const users = generateMockUsers()
  const awsAccounts = generateMockAwsAccounts(users)
  const azureAccounts = generateMockAzureAccounts(users)
  const gcpAccounts = generateMockGcpAccounts(users)
  const costData = generateMockCostData(awsAccounts, azureAccounts, gcpAccounts)
  const resources = generateMockResources(awsAccounts, azureAccounts, gcpAccounts)
  const recommendations = generateMockRecommendations(resources)
  const alerts = generateMockAlerts(users, awsAccounts, azureAccounts, gcpAccounts)

  return {
    users,
    awsAccounts,
    azureAccounts,
    gcpAccounts,
    costData,
    resources,
    recommendations,
    alerts,
  }
}

export {
  generateMockUsers,
  generateMockAwsAccounts,
  generateMockAzureAccounts,
  generateMockGcpAccounts,
  generateMockCostData,
  generateMockResources,
  generateMockRecommendations,
  generateMockAlerts,
}
