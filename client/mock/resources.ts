import { random } from "./index"

/**
 * Resource types by provider
 */
const resourceTypes = {
  aws: ["ec2", "rds", "s3", "lambda", "ebs", "elb", "dynamodb", "cloudfront"],
  azure: ["vm", "sql", "storage", "function", "disk", "lb", "cosmos", "cdn"],
  gcp: ["compute", "sql", "storage", "function", "disk", "lb", "bigtable", "cdn"],
}

/**
 * Regions by provider
 */
const regions = {
  aws: ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1", "sa-east-1"],
  azure: ["eastus", "westus2", "westeurope", "southeastasia", "brazilsouth"],
  gcp: ["us-east1", "us-west1", "europe-west1", "asia-southeast1", "southamerica-east1"],
}

/**
 * Status options
 */
const statuses = ["running", "stopped", "terminated", "pending", "error"]

/**
 * Generate a mock resource
 */
export function generateMockResource(provider: "aws" | "azure" | "gcp", accountId: string) {
  const resourceType = random.item(resourceTypes[provider])
  const region = random.item(regions[provider])
  const status = random.item(statuses)
  const utilization = random.number(0, 100)

  const resourceId = `${provider}-${resourceType}-${random.id()}`
  const resourceName = `${provider}-${resourceType}-${random.number(1000, 9999)}`

  const createdAt = random.date(new Date(2022, 0, 1), new Date())
  const lastUpdatedAt = random.date(createdAt, new Date())

  const cost = random.number(5, 500)
  const costPerMonth = cost * 30

  // Generate random tags
  const tags: Record<string, string> = {}
  if (random.boolean(0.7)) tags.Environment = random.item(["production", "staging", "development", "testing"])
  if (random.boolean(0.6)) tags.Project = random.item(["main", "analytics", "website", "backend", "mobile"])
  if (random.boolean(0.5)) tags.Owner = random.item(["devops", "backend", "frontend", "data", "platform"])
  if (random.boolean(0.4)) tags.CostCenter = random.item(["101", "102", "103", "104", "105"])

  // Generate resource-specific configuration
  const configuration: Record<string, any> = {}

  switch (resourceType) {
    case "ec2":
    case "vm":
    case "compute":
      configuration.instanceType = random.item(["t3.micro", "t3.small", "t3.medium", "m5.large", "c5.xlarge"])
      configuration.vCPUs = random.number(1, 16)
      configuration.memory = random.number(1, 64)
      configuration.os = random.item(["Linux", "Windows"])
      break

    case "rds":

    case "sql":
      configuration.instanceType = random.item(["db.t3.micro", "db.t3.small", "db.m5.large", "db.r5.xlarge"])
      configuration.engine = random.item(["mysql", "postgres", "sqlserver", "oracle"])
      configuration.version = random.item(["5.7", "8.0", "11", "12", "19c"])
      configuration.storage = random.number(20, 1000)
      configuration.multiAZ = random.boolean(0.3)
      break

    case "s3":
    case "storage":
      configuration.bucketType = random.item(["Standard", "Infrequent Access", "Glacier", "Deep Archive"])
      configuration.objectCount = random.number(100, 1000000)
      configuration.totalSize = random.number(1, 10000)
      break

    case "lambda":
    case "function":
      configuration.runtime = random.item(["nodejs16.x", "python3.9", "java11", "go1.x", "dotnet6"])
      configuration.memory = random.number(128, 3008)
      configuration.timeout = random.number(3, 900)
      configuration.concurrency = random.number(10, 1000)
      break

    default:
      // Generic configuration for other resource types
      configuration.size = random.item(["small", "medium", "large", "xlarge"])
      configuration.tier = random.item(["basic", "standard", "premium"])
  }

  // Generate metrics
  const metrics = {
    cpu: {
      average: utilization,
      peak: Math.min(100, utilization + random.number(5, 30)),
      datapoints: Array.from({ length: 24 }).map(() => ({
        timestamp: new Date(Date.now() - random.number(0, 24 * 60 * 60 * 1000)),
        value: Math.max(0, utilization + random.number(-10, 10)),
      })),
    },
    memory: {
      average: random.number(20, 90),
      peak: random.number(50, 100),
    },
    network: {
      inbound: random.number(10, 1000),
      outbound: random.number(10, 1000),
    },
  }

  return {
    id: random.uuid(),
    provider,
    accountId,
    resourceId,
    resourceName,
    resourceType,
    region,
    status,
    createdAt: createdAt.toISOString(),
    lastUpdatedAt: lastUpdatedAt.toISOString(),
    tags,
    metrics,
    configuration,
    cost,
    costPerMonth,
    utilization,
    lastSyncedAt: new Date().toISOString(),
    metadata: {},
  }
}

/**
 * Generate multiple mock resources
 */
export function generateMockResources(count = 50) {
  const resources = []

  for (let i = 0; i < count; i++) {
    const provider = random.item(["aws", "azure", "gcp"]) as "aws" | "azure" | "gcp"
    const accountId = `account-${random.number(1, 5)}`

    resources.push(generateMockResource(provider, accountId))
  }

  return resources
}

/**
 * Mock resources
 */
export const mockResources = generateMockResources(100)

/**
 * Get resources by provider
 */
export function getResourcesByProvider(provider: "aws" | "azure" | "gcp") {
  return mockResources.filter((resource) => resource.provider === provider)
}

/**
 * Get resources by account
 */
export function getResourcesByAccount(accountId: string) {
  return mockResources.filter((resource) => resource.accountId === accountId)
}

/**
 * Get idle resources (utilization < 10%)
 */
export function getIdleResources() {
  return mockResources.filter((resource) => resource.status === "running" && resource.utilization < 10)
}

/**
 * Get resource count by type
 */
export function getResourceCountByType() {
  const counts: Record<string, number> = {}

  mockResources.forEach((resource) => {
    const key = `${resource.provider}-${resource.resourceType}`
    counts[key] = (counts[key] || 0) + 1
  })

  return Object.entries(counts).map(([key, count]) => {
    const [provider, resourceType] = key.split("-")
    return { provider, resourceType, count }
  })
}
