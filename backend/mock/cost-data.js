/**
 * Mock cost data for backend testing
 */

import { v4 as uuidv4 } from "uuid"

/**
 * Generate daily cost data for a specific account
 * @param {string} accountId Account ID
 * @param {string} provider Provider (aws, azure, gcp)
 * @param {number} days Number of days to generate data for
 * @param {number} baseAmount Base amount for cost calculation
 * @param {number} variance Percentage variance for randomization
 * @param {Array} services Array of services to generate costs for
 * @returns {Array} Array of cost data objects
 */
export function generateDailyCostData(
  accountId,
  provider,
  days = 30,
  baseAmount = 100,
  variance = 20,
  services = null,
) {
  const result = []
  const today = new Date()

  // Default services by provider
  const defaultServices = {
    aws: ["EC2", "S3", "RDS", "Lambda", "ECS", "CloudFront", "DynamoDB", "ELB"],
    azure: ["Virtual Machines", "Storage", "SQL Database", "App Service", "Functions", "Cosmos DB", "Networking"],
    gcp: ["Compute Engine", "Cloud Storage", "Cloud SQL", "App Engine", "BigQuery", "Kubernetes Engine", "Networking"],
  }

  const servicesForProvider = services || defaultServices[provider]

  // Generate data for the specified number of days
  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split("T")[0]

    // Generate cost for each service
    servicesForProvider.forEach((service, serviceIndex) => {
      // Base amount with some randomness
      const randomFactor = 1 + (Math.random() * variance * 2 - variance) / 100
      // Services have different cost profiles
      const serviceMultiplier = 1 - serviceIndex * 0.1
      // Weekends have lower costs
      const dayOfWeek = date.getDay()
      const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1
      // Recent days might have incomplete data
      const recencyFactor = i < 2 ? 0.8 : 1

      const cost = baseAmount * randomFactor * serviceMultiplier * weekendFactor * recencyFactor

      result.push({
        id: uuidv4(),
        provider,
        accountId,
        date: dateString,
        service,
        region: ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"][Math.floor(Math.random() * 4)],
        cost: Number.parseFloat(cost.toFixed(2)),
        currency: "USD",
        usageQuantity: Number.parseFloat((cost * 0.8).toFixed(2)),
        usageUnit: service.includes("Storage") ? "GB" : "Hours",
        tags: {
          Environment: ["production", "development", "staging", "testing"][Math.floor(Math.random() * 4)],
          Project: ["web", "api", "database", "analytics"][Math.floor(Math.random() * 4)],
        },
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })
  }

  return result
}

/**
 * Generate mock cost data for all accounts
 * @param {Array} awsAccounts Array of AWS account objects
 * @param {Array} azureAccounts Array of Azure account objects
 * @param {Array} gcpAccounts Array of GCP account objects
 * @returns {Array} Array of cost data objects
 */
export function generateMockCostData(awsAccounts, azureAccounts, gcpAccounts) {
  const allCostData = []

  // AWS accounts
  awsAccounts.forEach((account) => {
    // Vary the base amount by account to simulate different sized environments
    const baseAmount = 50 + Math.random() * 150
    allCostData.push(...generateDailyCostData(account.id, "aws", 30, baseAmount, 25))
  })

  // Azure accounts
  azureAccounts.forEach((account) => {
    const baseAmount = 40 + Math.random() * 120
    allCostData.push(...generateDailyCostData(account.id, "azure", 30, baseAmount, 20))
  })

  // GCP accounts
  gcpAccounts.forEach((account) => {
    const baseAmount = 30 + Math.random() * 100
    allCostData.push(...generateDailyCostData(account.id, "gcp", 30, baseAmount, 15))
  })

  return allCostData
}

/**
 * Get cost data for a specific account
 * @param {string} accountId Account ID
 * @param {string} provider Provider (aws, azure, gcp)
 * @param {Array} costData Array of cost data objects (optional)
 * @returns {Array} Array of cost data objects for the account
 */
export function getMockCostDataByAccount(accountId, provider, costData = null) {
  if (!costData) {
    return generateDailyCostData(accountId, provider)
  }
  return costData.filter((item) => item.accountId === accountId && item.provider === provider)
}

/**
 * Get cost data for a specific date range
 * @param {string} startDate Start date (YYYY-MM-DD)
 * @param {string} endDate End date (YYYY-MM-DD)
 * @param {Array} costData Array of cost data objects
 * @returns {Array} Array of cost data objects for the date range
 */
export function getMockCostDataByDateRange(startDate, endDate, costData) {
  return costData.filter((item) => item.date >= startDate && item.date <= endDate)
}

/**
 * Get cost data grouped by service
 * @param {Array} costData Array of cost data objects
 * @returns {Object} Object with services as keys and total cost as values
 */
export function getMockCostDataByService(costData) {
  const result = {}

  costData.forEach((item) => {
    if (!result[item.service]) {
      result[item.service] = 0
    }
    result[item.service] += item.cost
  })

  return result
}

/**
 * Get cost forecast
 * @param {Array} costData Array of cost data objects
 * @returns {Object} Cost forecast object
 */
export function getMockCostForecast(costData) {
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfPrevMonth = new Date(firstDayOfMonth)
  lastDayOfPrevMonth.setDate(lastDayOfPrevMonth.getDate() - 1)
  const firstDayOfPrevMonth = new Date(lastDayOfPrevMonth.getFullYear(), lastDayOfPrevMonth.getMonth(), 1)

  // Format dates
  const firstDayOfMonthStr = firstDayOfMonth.toISOString().split("T")[0]
  const todayStr = today.toISOString().split("T")[0]
  const firstDayOfPrevMonthStr = firstDayOfPrevMonth.toISOString().split("T")[0]
  const lastDayOfPrevMonthStr = lastDayOfPrevMonth.toISOString().split("T")[0]

  // Current month costs
  const currentMonthCosts = costData.filter((item) => item.date >= firstDayOfMonthStr && item.date <= todayStr)
  const currentCost = currentMonthCosts.reduce((sum, item) => sum + item.cost, 0)

  // Previous month costs
  const prevMonthCosts = costData.filter(
    (item) => item.date >= firstDayOfPrevMonthStr && item.date <= lastDayOfPrevMonthStr,
  )
  const previousMonthCost = prevMonthCosts.reduce((sum, item) => sum + item.cost, 0)

  // Calculate daily average and projected cost
  const daysPassed = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const dailyAverage = currentCost / daysPassed
  const projectedCost = dailyAverage * daysInMonth

  // Calculate change
  const changeAmount = projectedCost - previousMonthCost
  const changePercentage = (changeAmount / previousMonthCost) * 100

  return {
    currentCost: Number.parseFloat(currentCost.toFixed(2)),
    projectedCost: Number.parseFloat(projectedCost.toFixed(2)),
    previousMonthCost: Number.parseFloat(previousMonthCost.toFixed(2)),
    changeAmount: Number.parseFloat(changeAmount.toFixed(2)),
    changePercentage: Number.parseFloat(changePercentage.toFixed(2)),
    dailyAverage: Number.parseFloat(dailyAverage.toFixed(2)),
    daysInMonth,
    daysPassed,
    daysRemaining: daysInMonth - daysPassed,
  }
}
