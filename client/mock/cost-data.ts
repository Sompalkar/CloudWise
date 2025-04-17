/**
 * Mock cost data
 */

export interface CostData {
    id: string
    provider: "aws" | "azure" | "gcp"
    accountId: string
    date: string
    service?: string
    region?: string
    resourceId?: string
    resourceName?: string
    cost: number
    currency: string
    usageQuantity?: number
    usageUnit?: string
    tags?: Record<string, string>
  }
  
  // Generate daily cost data for the last 30 days
  export function generateMockCostData(
    accountId: string,
    provider: "aws" | "azure" | "gcp",
    baseAmount = 100,
    variance = 20,
    services?: string[],
  ): CostData[] {
    const result: CostData[] = []
    const today = new Date()
    const defaultServices = {
      aws: ["EC2", "S3", "RDS", "Lambda", "ECS", "CloudFront", "DynamoDB", "ELB"],
      azure: ["Virtual Machines", "Storage", "SQL Database", "App Service", "Functions", "Cosmos DB", "Networking"],
      gcp: ["Compute Engine", "Cloud Storage", "Cloud SQL", "App Engine", "BigQuery", "Kubernetes Engine", "Networking"],
    }
  
    const servicesForProvider = services || defaultServices[provider]
  
    // Generate data for the last 30 days
    for (let i = 0; i < 30; i++) {
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
          id: `cost-${provider}-${accountId}-${dateString}-${service}`.replace(/\s+/g, "-").toLowerCase(),
          provider,
          accountId,
          date: dateString,
          service,
          cost: Number.parseFloat(cost.toFixed(2)),
          currency: "USD",
          usageQuantity: Number.parseFloat((cost * 0.8).toFixed(2)),
          usageUnit: service.includes("Storage") ? "GB" : "Hours",
        })
      })
    }
  
    return result
  }
  
  // Generate mock cost data for all accounts
  export function generateAllMockCostData(): CostData[] {
    const allCostData: CostData[] = []
  
    // AWS accounts
    allCostData.push(...generateMockCostData("aws-1", "aws", 150, 25))
    allCostData.push(...generateMockCostData("aws-2", "aws", 80, 30))
    allCostData.push(...generateMockCostData("aws-3", "aws", 120, 20))
    allCostData.push(...generateMockCostData("aws-4", "aws", 200, 15))
  
    // Azure accounts
    allCostData.push(...generateMockCostData("azure-1", "azure", 130, 20))
    allCostData.push(...generateMockCostData("azure-2", "azure", 90, 25))
    allCostData.push(...generateMockCostData("azure-3", "azure", 110, 30))
  
    // GCP accounts
    allCostData.push(...generateMockCostData("gcp-1", "gcp", 100, 20))
    allCostData.push(...generateMockCostData("gcp-2", "gcp", 70, 15))
    allCostData.push(...generateMockCostData("gcp-3", "gcp", 90, 25))
  
    return allCostData
  }
  
  // Get cost data for a specific account
  export function getMockCostDataByAccount(accountId: string, provider: "aws" | "azure" | "gcp"): CostData[] {
    return generateMockCostData(accountId, provider)
  }
  
  // Get cost data grouped by date
  export function getMockCostDataByDate(
    startDate?: string,
    endDate?: string,
    groupBy: "daily" | "monthly" = "daily",
  ): Record<string, { aws: number; azure: number; gcp: number }> {
    const allCostData = generateAllMockCostData()
    const result: Record<string, { aws: number; azure: number; gcp: number }> = {}
  
    // Filter by date range if provided
    const filteredData = allCostData.filter((item) => {
      if (startDate && item.date < startDate) return false
      if (endDate && item.date > endDate) return false
      return true
    })
  
    // Group by date
    filteredData.forEach((item) => {
      let dateKey = item.date
  
      // For monthly grouping, use YYYY-MM format
      if (groupBy === "monthly") {
        dateKey = dateKey.substring(0, 7)
      }
  
      if (!result[dateKey]) {
        result[dateKey] = { aws: 0, azure: 0, gcp: 0 }
      }
  
      result[dateKey][item.provider] += item.cost
    })
  
    return result
  }
  
  // Get cost data grouped by service
  export function getMockCostDataByService(startDate?: string, endDate?: string): Record<string, number> {
    const allCostData = generateAllMockCostData()
    const result: Record<string, number> = {}
  
    // Filter by date range if provided
    const filteredData = allCostData.filter((item) => {
      if (startDate && item.date < startDate) return false
      if (endDate && item.date > endDate) return false
      return true
    })
  
    // Group by service
    filteredData.forEach((item) => {
      if (item.service) {
        if (!result[item.service]) {
          result[item.service] = 0
        }
        result[item.service] += item.cost
      }
    })
  
    return result
  }
  
  // Get cost forecast
  export function getMockCostForecast(): {
    currentCost: number
    projectedCost: number
    previousMonthCost: number
    changeAmount: number
    changePercentage: number
    dailyAverage: number
  } {
    const allCostData = generateAllMockCostData()
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
    const currentMonthCosts = allCostData.filter((item) => item.date >= firstDayOfMonthStr && item.date <= todayStr)
    const currentCost = currentMonthCosts.reduce((sum, item) => sum + item.cost, 0)
  
    // Previous month costs
    const prevMonthCosts = allCostData.filter(
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
    }
  }
  