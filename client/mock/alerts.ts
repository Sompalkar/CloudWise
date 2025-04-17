/**
 * Mock alert data
 */

export interface Alert {
    id: string
    userId: string
    provider: "aws" | "azure" | "gcp" | "system"
    accountId?: string
    resourceId?: string
    title: string
    message: string
    severity: "critical" | "high" | "medium" | "low" | "info"
    status: "new" | "read" | "acknowledged" | "resolved"
    category: "cost" | "security" | "performance" | "availability" | "other"
    metadata?: Record<string, any>
    notificationSent: boolean
    createdAt: string
    updatedAt: string
    resolvedAt?: string
  }
  
  // Generate mock alerts
  export function generateMockAlerts(userId: string, count = 20): Alert[] {
    const alerts: Alert[] = []
    const now = new Date()
  
    // Alert templates
    const alertTemplates = [
      // Cost alerts
      {
        provider: "aws",
        title: "Unusual cost increase detected",
        message: "Your AWS account has experienced a 35% increase in daily costs compared to the previous week average.",
        severity: "high",
        category: "cost",
        metadata: {
          previousAverage: 120.5,
          currentCost: 162.68,
          percentageIncrease: 35,
          services: ["EC2", "RDS"],
        },
      },
      {
        provider: "azure",
        title: "Monthly budget threshold exceeded",
        message:
          "Your Azure subscription has exceeded 80% of its monthly budget allocation with 10 days remaining in the billing cycle.",
        severity: "medium",
        category: "cost",
        metadata: {
          budgetName: "Production Azure",
          budgetAmount: 5000,
          currentSpend: 4100,
          percentageUsed: 82,
          remainingDays: 10,
        },
      },
      {
        provider: "gcp",
        title: "Potential cost optimization found",
        message: "We've identified 3 idle GCP instances that could be resized or terminated to save costs.",
        severity: "low",
        category: "cost",
        metadata: {
          instanceCount: 3,
          potentialSavings: 120.75,
          recommendationIds: ["rec-gcp-1", "rec-gcp-2", "rec-gcp-3"],
        },
      },
  
      // Security alerts
      {
        provider: "aws",
        title: "Security group with unrestricted access",
        message: "A security group in your AWS account has unrestricted (0.0.0.0/0) access to port 22 (SSH).",
        severity: "critical",
        category: "security",
        metadata: {
          securityGroupId: "sg-12345",
          port: 22,
          protocol: "TCP",
          cidrRange: "0.0.0.0/0",
        },
      },
      {
        provider: "azure",
        title: "Storage account with public access",
        message: "An Azure storage account has been configured with public access, potentially exposing sensitive data.",
        severity: "high",
        category: "security",
        metadata: {
          storageAccountName: "proddata12345",
          containerCount: 3,
          publicContainers: 1,
        },
      },
  
      // Performance alerts
      {
        provider: "aws",
        title: "High CPU utilization",
        message: "An EC2 instance has been running at over 90% CPU utilization for the past 2 hours.",
        severity: "medium",
        category: "performance",
        metadata: {
          instanceId: "i-12345abcdef",
          instanceType: "t3.medium",
          averageCpu: 92.5,
          duration: "2 hours",
        },
      },
      {
        provider: "gcp",
        title: "Database approaching storage limit",
        message: "A Cloud SQL instance is at 85% of its allocated storage capacity.",
        severity: "medium",
        category: "performance",
        metadata: {
          instanceName: "prod-db-1",
          allocatedStorage: "100GB",
          usedStorage: "85GB",
          percentageUsed: 85,
        },
      },
  
      // Availability alerts
      {
        provider: "aws",
        title: "Service disruption in us-east-1",
        message: "AWS has reported service disruptions in the us-east-1 region that may affect your resources.",
        severity: "high",
        category: "availability",
        metadata: {
          region: "us-east-1",
          affectedServices: ["EC2", "RDS", "ElastiCache"],
          awsStatusPage: "https://status.aws.amazon.com/",
        },
      },
      {
        provider: "azure",
        title: "Virtual machine unreachable",
        message: "An Azure virtual machine has been unreachable for the past 15 minutes.",
        severity: "high",
        category: "availability",
        metadata: {
          vmName: "prod-api-server-3",
          resourceGroup: "production-rg",
          lastSeen: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
        },
      },
  
      // System alerts
      {
        provider: "system",
        title: "CloudWise integration error",
        message: "Failed to sync data from your AWS account due to insufficient permissions.",
        severity: "medium",
        category: "other",
        metadata: {
          accountId: "aws-1",
          errorCode: "AccessDenied",
          requiredPermissions: ["ce:GetCostAndUsage", "ec2:DescribeInstances"],
        },
      },
      {
        provider: "system",
        title: "New recommendation available",
        message: "A new cost-saving recommendation has been generated for your AWS account.",
        severity: "info",
        category: "cost",
        metadata: {
          recommendationId: "rec-aws-123",
          potentialSavings: 45.2,
          resourceType: "EC2",
        },
      },
    ]
  
    // Generate random alerts
    for (let i = 0; i < count; i++) {
      // Select a random template
      const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)]
  
      // Generate random dates
      const createdAt = new Date(now)
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 14)) // Within last 14 days
      createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 24)) // Random hour
      createdAt.setMinutes(createdAt.getMinutes() - Math.floor(Math.random() * 60)) // Random minute
  
      const updatedAt = new Date(createdAt)
      if (Math.random() > 0.5) {
        updatedAt.setHours(updatedAt.getHours() + Math.floor(Math.random() * 12)) // Some time after creation
      }
  
      // Determine status (weighted towards newer alerts)
      let status: "new" | "read" | "acknowledged" | "resolved"
      const statusRandom = Math.random()
      if (statusRandom < 0.4) {
        status = "new"
      } else if (statusRandom < 0.7) {
        status = "read"
      } else if (statusRandom < 0.9) {
        status = "acknowledged"
      } else {
        status = "resolved"
      }
  
      // For resolved alerts, add resolved date
      let resolvedAt: string | undefined
      if (status === "resolved") {
        const resolvedDate = new Date(updatedAt)
        resolvedDate.setHours(resolvedDate.getHours() + Math.floor(Math.random() * 24))
        resolvedAt = resolvedDate.toISOString()
      }
  
      // Determine account ID based on provider
      let accountId: string | undefined
      if (template.provider === "aws") {
        accountId = ["aws-1", "aws-2", "aws-3", "aws-4"][Math.floor(Math.random() * 4)]
      } else if (template.provider === "azure") {
        accountId = ["azure-1", "azure-2", "azure-3"][Math.floor(Math.random() * 3)]
      } else if (template.provider === "gcp") {
        accountId = ["gcp-1", "gcp-2", "gcp-3"][Math.floor(Math.random() * 3)]
      }
  
      // Create the alert
      alerts.push({
        id: `alert-${i}-${Math.random().toString(36).substring(2, 9)}`,
        userId,
        provider: template.provider as "aws" | "azure" | "gcp" | "system",
        accountId,
        resourceId: template.metadata?.instanceId || template.metadata?.vmName || template.metadata?.storageAccountName,
        title: template.title,
        message: template.message,
        severity: template.severity as "critical" | "high" | "medium" | "low" | "info",
        status,
        category: template.category as "cost" | "security" | "performance" | "availability" | "other",
        metadata: template.metadata,
        notificationSent: Math.random() > 0.2, // 80% chance notification was sent
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
        resolvedAt,
      })
    }
  
    // Sort by created date (newest first)
    return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  
  // Get alerts for a specific user
  export function getMockAlertsByUserId(userId: string): Alert[] {
    return generateMockAlerts(userId)
  }
  
  // Get alerts by status
  export function getMockAlertsByStatus(userId: string, status: "new" | "read" | "acknowledged" | "resolved"): Alert[] {
    return generateMockAlerts(userId).filter((alert) => alert.status === status)
  }
  
  // Get alerts by severity
  export function getMockAlertsBySeverity(
    userId: string,
    severity: "critical" | "high" | "medium" | "low" | "info",
  ): Alert[] {
    return generateMockAlerts(userId).filter((alert) => alert.severity === severity)
  }
  
  // Get alerts by category
  export function getMockAlertsByCategory(
    userId: string,
    category: "cost" | "security" | "performance" | "availability" | "other",
  ): Alert[] {
    return generateMockAlerts(userId).filter((alert) => alert.category === category)
  }
  
  // Get alert by ID
  export function getMockAlertById(userId: string, id: string): Alert | undefined {
    return generateMockAlerts(userId).find((alert) => alert.id === id)
  }
  
  // Get alert summary
  export function getMockAlertSummary(userId: string): {
    totalCount: number
    byStatus: Record<string, number>
    bySeverity: Record<string, number>
    byCategory: Record<string, number>
  } {
    const alerts = generateMockAlerts(userId)
  
    // Count by status
    const byStatus: Record<string, number> = {
      new: 0,
      read: 0,
      acknowledged: 0,
      resolved: 0,
    }
  
    // Count by severity
    const bySeverity: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    }
  
    // Count by category
    const byCategory: Record<string, number> = {
      cost: 0,
      security: 0,
      performance: 0,
      availability: 0,
      other: 0,
    }
  
    // Count alerts
    alerts.forEach((alert) => {
      byStatus[alert.status]++
      bySeverity[alert.severity]++
      byCategory[alert.category]++
    })
  
    return {
      totalCount: alerts.length,
      byStatus,
      bySeverity,
      byCategory,
    }
  }
  