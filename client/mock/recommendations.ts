/**
 * Mock recommendation data
 */

// import { getMockIdleResources } from "./resources"
import { getMockIdleResources } from "./resources"

export interface Recommendation {
  id: string
  provider: "aws" | "azure" | "gcp"
  accountId: string
  resourceId: string
  resourceType: string
  title: string
  description: string
  recommendationType: "rightsizing" | "termination" | "scheduling" | "reservation" | "storage" | "network" | "other"
  impact: "high" | "medium" | "low"
  potentialSavings: number
  currency: string
  status: "open" | "in_progress" | "implemented" | "dismissed" | "expired"
  actionDetails?: Record<string, any>
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
  expiresAt?: string
}

// Generate recommendations based on idle resources
function generateIdleResourceRecommendations(): Recommendation[] {
  const idleResources = getMockIdleResources()
  const recommendations: Recommendation[] = []

  idleResources.forEach((resource, index) => {
    const now = new Date()
    const createdAt = new Date(now)
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30))

    const updatedAt = new Date(createdAt)
    updatedAt.setDate(updatedAt.getDate() + Math.floor(Math.random() * 5))

    const expiresAt = new Date(now)
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Determine recommendation type based on resource type and utilization
    let recommendationType: "rightsizing" | "termination" | "scheduling" = "rightsizing"
    let title = ""
    let description = ""
    let potentialSavings = 0
    let actionDetails: Record<string, any> = {}

    if (resource.utilization !== undefined && resource.utilization < 5) {
      recommendationType = "termination"
      title = `Idle ${resource.resourceType} - Consider Termination`
      description = `${resource.resourceName || resource.resourceId} has been running with very low utilization (${resource.utilization.toFixed(1)}%) for an extended period. Consider terminating this resource to save costs.`
      potentialSavings = resource.costPerMonth || 0
      actionDetails = {
        action: "terminate",
        resourceId: resource.resourceId,
        resourceType: resource.resourceType,
      }
    } else if (resource.utilization !== undefined && resource.utilization < 10) {
      recommendationType = "rightsizing"
      title = `Underutilized ${resource.resourceType} - Consider Downsizing`
      description = `${resource.resourceName || resource.resourceId} is underutilized (${resource.utilization.toFixed(1)}%). Consider downsizing to a smaller instance type to save costs.`
      potentialSavings = (resource.costPerMonth || 0) * 0.5 // Assume 50% savings from downsizing

      // Add specific details based on provider and resource type
      if (resource.provider === "aws" && resource.resourceType === "ec2") {
        const currentType = resource.configuration?.instanceType
        const suggestedType =
          currentType?.replace("xlarge", "large") ||
          currentType?.replace("large", "medium") ||
          currentType?.replace("medium", "small")

        actionDetails = {
          action: "resize",
          resourceId: resource.resourceId,
          currentType,
          suggestedType,
          estimatedSavings: potentialSavings,
        }
      } else if (resource.provider === "azure" && resource.resourceType === "virtualMachine") {
        const currentSize = resource.configuration?.vmSize
        const suggestedSize = currentSize?.includes("Standard_D")
          ? currentSize.replace("Standard_D", "Standard_B")
          : currentSize?.replace("v3", "v2")

        actionDetails = {
          action: "resize",
          resourceId: resource.resourceId,
          currentSize,
          suggestedSize,
          estimatedSavings: potentialSavings,
        }
      } else if (resource.provider === "gcp" && resource.resourceType === "computeInstance") {
        const currentType = resource.configuration?.machineType
        const suggestedType = currentType?.includes("n1-standard")
          ? currentType.replace("n1-standard", "e2-standard")
          : currentType?.replace("n1-highcpu", "e2-highcpu")

        actionDetails = {
          action: "resize",
          resourceId: resource.resourceId,
          currentType,
          suggestedType,
          estimatedSavings: potentialSavings,
        }
      }
    } else {
      recommendationType = "scheduling"
      title = `Optimize ${resource.resourceType} Usage with Scheduling`
      description = `${resource.resourceName || resource.resourceId} could benefit from scheduling. Consider implementing start/stop schedules during non-business hours to reduce costs.`
      potentialSavings = (resource.costPerMonth || 0) * 0.3 // Assume 30% savings from scheduling
      actionDetails = {
        action: "schedule",
        resourceId: resource.resourceId,
        suggestedSchedule: "Mon-Fri, 8AM-6PM",
        estimatedSavings: potentialSavings,
      }
    }

    // Randomly assign status, weighted towards open
    const statusRandom = Math.random()
    let status: "open" | "in_progress" | "implemented" | "dismissed" | "expired"
    if (statusRandom < 0.6) {
      status = "open"
    } else if (statusRandom < 0.75) {
      status = "in_progress"
    } else if (statusRandom < 0.85) {
      status = "implemented"
    } else if (statusRandom < 0.95) {
      status = "dismissed"
    } else {
      status = "expired"
    }

    // Determine impact based on potential savings
    let impact: "high" | "medium" | "low"
    if (potentialSavings > 100) {
      impact = "high"
    } else if (potentialSavings > 50) {
      impact = "medium"
    } else {
      impact = "low"
    }

    recommendations.push({
      id: `rec-${resource.provider}-${index}`,
      provider: resource.provider,
      accountId: resource.accountId,
      resourceId: resource.resourceId,
      resourceType: resource.resourceType,
      title,
      description,
      recommendationType,
      impact,
      potentialSavings: Number.parseFloat(potentialSavings.toFixed(2)),
      currency: "USD",
      status,
      actionDetails,
      metadata: {
        detectedAt: createdAt.toISOString(),
        resourceUtilization: resource.utilization,
        resourceCost: resource.costPerMonth,
        statusHistory:
          status !== "open"
            ? [
                {
                  status: "open",
                  timestamp: createdAt.toISOString(),
                  userId: "user-1",
                },
                {
                  status,
                  timestamp: updatedAt.toISOString(),
                  userId: "user-1",
                },
              ]
            : undefined,
      },
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    })
  })

  return recommendations
}

// Generate additional recommendations not tied to specific resources
function generateAdditionalRecommendations(): Recommendation[] {
  const recommendations: Recommendation[] = []
  const now = new Date()

  // Reserved instances recommendation
  recommendations.push({
    id: "rec-aws-ri-1",
    provider: "aws",
    accountId: "aws-1",
    resourceId: "multiple",
    resourceType: "ec2",
    title: "Reserved Instance Opportunity",
    description:
      "You have 12 consistently running EC2 instances that would benefit from Reserved Instance pricing. Converting to 1-year RIs could save approximately 40% on these instances.",
    recommendationType: "reservation",
    impact: "high",
    potentialSavings: 1240.5,
    currency: "USD",
    status: "open",
    actionDetails: {
      action: "purchase_ri",
      instanceCount: 12,
      term: "1-year",
      paymentOption: "partial_upfront",
      estimatedSavings: 1240.5,
    },
    metadata: {
      detectedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      instanceTypes: ["m5.large", "c5.xlarge"],
      currentMonthlyCost: 3101.25,
    },
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  })

  // Unattached volumes recommendation
  recommendations.push({
    id: "rec-aws-ebs-1",
    provider: "aws",
    accountId: "aws-1",
    resourceId: "multiple",
    resourceType: "ebs",
    title: "Unattached EBS Volumes",
    description:
      "You have 5 EBS volumes that are not attached to any instances. Deleting these volumes could save approximately $45 per month.",
    recommendationType: "storage",
    impact: "medium",
    potentialSavings: 45.0,
    currency: "USD",
    status: "in_progress",
    actionDetails: {
      action: "delete",
      volumeCount: 5,
      volumeIds: ["vol-123456", "vol-234567", "vol-345678", "vol-456789", "vol-567890"],
      estimatedSavings: 45.0,
    },
    metadata: {
      detectedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      statusHistory: [
        {
          status: "open",
          timestamp: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          userId: "user-1",
        },
        {
          status: "in_progress",
          timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          userId: "user-1",
        },
      ],
    },
    createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  })

  // Azure reserved instances
  recommendations.push({
    id: "rec-azure-ri-1",
    provider: "azure",
    accountId: "azure-1",
    resourceId: "multiple",
    resourceType: "virtualMachine",
    title: "Azure Reserved Instance Opportunity",
    description:
      "You have 8 consistently running Azure VMs that would benefit from Reserved Instance pricing. Converting to 3-year RIs could save approximately 60% on these instances.",
    recommendationType: "reservation",
    impact: "high",
    potentialSavings: 950.25,
    currency: "USD",
    status: "open",
    actionDetails: {
      action: "purchase_ri",
      instanceCount: 8,
      term: "3-year",
      paymentOption: "full_upfront",
      estimatedSavings: 950.25,
    },
    metadata: {
      detectedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      vmSizes: ["Standard_D2s_v3", "Standard_D4s_v3"],
      currentMonthlyCost: 1583.75,
    },
    createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  })

  // GCP sustained use discounts
  recommendations.push({
    id: "rec-gcp-sud-1",
    provider: "gcp",
    accountId: "gcp-1",
    resourceId: "multiple",
    resourceType: "computeInstance",
    title: "Optimize for GCP Sustained Use Discounts",
    description:
      "Consolidate your workloads to fewer instances to maximize GCP sustained use discounts. This could increase your automatic discounts by approximately 15%.",
    recommendationType: "other",
    impact: "medium",
    potentialSavings: 320.75,
    currency: "USD",
    status: "dismissed",
    actionDetails: {
      action: "consolidate",
      instanceCount: 10,
      targetCount: 6,
      estimatedSavings: 320.75,
    },
    metadata: {
      detectedAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      statusHistory: [
        {
          status: "open",
          timestamp: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          userId: "user-1",
        },
        {
          status: "dismissed",
          timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          userId: "user-1",
          reason: "Workloads cannot be consolidated due to isolation requirements",
        },
      ],
    },
    createdAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  })

  // Network optimization
  recommendations.push({
    id: "rec-aws-network-1",
    provider: "aws",
    accountId: "aws-2",
    resourceId: "multiple",
    resourceType: "network",
    title: "Optimize Data Transfer Costs",
    description:
      "Your applications are transferring large amounts of data between regions. Consider using CloudFront or relocating resources to the same region to reduce data transfer costs.",
    recommendationType: "network",
    impact: "medium",
    potentialSavings: 215.3,
    currency: "USD",
    status: "implemented",
    actionDetails: {
      action: "optimize_transfer",
      currentTransferGB: 5000,
      estimatedSavings: 215.3,
      suggestedActions: ["Use CloudFront", "Relocate resources to same region"],
    },
    metadata: {
      detectedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      statusHistory: [
        {
          status: "open",
          timestamp: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          userId: "user-2",
        },
        {
          status: "in_progress",
          timestamp: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          userId: "user-2",
        },
        {
          status: "implemented",
          timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          userId: "user-2",
          notes: "Implemented CloudFront distribution for content delivery",
        },
      ],
    },
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  })

  return recommendations
}

// Generate all mock recommendations
export function generateAllMockRecommendations(): Recommendation[] {
  const idleRecommendations = generateIdleResourceRecommendations()
  const additionalRecommendations = generateAdditionalRecommendations()

  return [...idleRecommendations, ...additionalRecommendations]
}

// Get recommendations for a specific account
export function getMockRecommendationsByAccount(
  accountId: string,
  provider: "aws" | "azure" | "gcp",
): Recommendation[] {
  const allRecommendations = generateAllMockRecommendations()
  return allRecommendations.filter((rec) => rec.accountId === accountId && rec.provider === provider)
}

// Get recommendations by status
export function getMockRecommendationsByStatus(
  status: "open" | "in_progress" | "implemented" | "dismissed" | "expired",
): Recommendation[] {
  const allRecommendations = generateAllMockRecommendations()
  return allRecommendations.filter((rec) => rec.status === status)
}

// Get recommendations by impact
export function getMockRecommendationsByImpact(impact: "high" | "medium" | "low"): Recommendation[] {
  const allRecommendations = generateAllMockRecommendations()
  return allRecommendations.filter((rec) => rec.impact === impact)
}

// Get recommendations by type
export function getMockRecommendationsByType(
  type: "rightsizing" | "termination" | "scheduling" | "reservation" | "storage" | "network" | "other",
): Recommendation[] {
  const allRecommendations = generateAllMockRecommendations()
  return allRecommendations.filter((rec) => rec.recommendationType === type)
}

// Get recommendation by ID
export function getMockRecommendationById(id: string): Recommendation | undefined {
  const allRecommendations = generateAllMockRecommendations()
  return allRecommendations.find((rec) => rec.id === id)
}

// Get recommendation summary
export function getMockRecommendationSummary(): {
  totalCount: number
  openCount: number
  implementedCount: number
  dismissedCount: number
  totalPotentialSavings: number
  implementedSavings: number
  byType: Record<string, { count: number; savings: number }>
  byProvider: Record<string, { count: number; savings: number }>
} {
  const allRecommendations = generateAllMockRecommendations()

  const totalCount = allRecommendations.length
  const openCount = allRecommendations.filter((rec) => rec.status === "open").length
  const implementedCount = allRecommendations.filter((rec) => rec.status === "implemented").length
  const dismissedCount = allRecommendations.filter((rec) => rec.status === "dismissed").length

  const totalPotentialSavings = Number.parseFloat(
    allRecommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0).toFixed(2),
  )
  const implementedSavings = Number.parseFloat(
    allRecommendations
      .filter((rec) => rec.status === "implemented")
      .reduce((sum, rec) => sum + rec.potentialSavings, 0)
      .toFixed(2),
  )

  // Group by type
  const byType: Record<string, { count: number; savings: number }> = {}
  allRecommendations.forEach((rec) => {
    if (!byType[rec.recommendationType]) {
      byType[rec.recommendationType] = { count: 0, savings: 0 }
    }
    byType[rec.recommendationType].count++
    byType[rec.recommendationType].savings += rec.potentialSavings
  })

  // Format savings in byType
  Object.keys(byType).forEach((key) => {
    byType[key].savings = Number.parseFloat(byType[key].savings.toFixed(2))
  })

  // Group by provider
  const byProvider: Record<string, { count: number; savings: number }> = {
    aws: { count: 0, savings: 0 },
    azure: { count: 0, savings: 0 },
    gcp: { count: 0, savings: 0 },
  }

  allRecommendations.forEach((rec) => {
    byProvider[rec.provider].count++
    byProvider[rec.provider].savings += rec.potentialSavings
  })

  // Format savings in byProvider
  Object.keys(byProvider).forEach((key) => {
    byProvider[key].savings = Number.parseFloat(byProvider[key].savings.toFixed(2))
  })

  return {
    totalCount,
    openCount,
    implementedCount,
    dismissedCount,
    totalPotentialSavings,
    implementedSavings,
    byType,
    byProvider,
  }
}
