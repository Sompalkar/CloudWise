import { v4 as uuidv4 } from "uuid"

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
 * Helper function to get a random item from an array
 */
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Helper function to get a random number between min and max
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Helper function to get a random boolean with a given probability
 */
function getRandomBoolean(probability = 0.5) {
  return Math.random() < probability
}

/**
 * Helper function to get a random date between start and end
 */
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

/**
 * Helper function to get a random ID
 */
function getRandomId() {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * Generate a mock resource
 */
export function generateMockResource(provider, accountId) {
  const resourceType = getRandomItem(resourceTypes[provider])
  const region = getRandomItem(regions[provider])
  const status = getRandomItem(statuses)
  const utilization = getRandomNumber(0, 100)

  const resourceId = `${provider}-${resourceType}-${getRandomId()}`
  const resourceName = `${provider}-${resourceType}-${getRandomNumber(1000, 9999)}`

  const createdAt = getRandomDate(new Date(2022, 0, 1), new Date())
  const lastUpdatedAt = getRandomDate(createdAt, new Date())

  const cost = getRandomNumber(5, 500)
  const costPerMonth = cost * 30

  // Generate random tags
  const tags = {}
  if (getRandomBoolean(0.7)) tags.Environment = getRandomItem(["production", "staging", "development", "testing"])
  if (getRandomBoolean(0.6)) tags.Project = getRandomItem(["main", "analytics", "website", "backend", "mobile"])
  if (getRandomBoolean(0.5)) tags.Owner = getRandomItem(["devops", "backend", "frontend", "data", "platform"])
  if (getRandomBoolean(0.4)) tags.CostCenter = getRandomItem(["101", "102", "103", "104", "105"])

  // Generate resource-specific configuration
  const configuration = {}

  switch (resourceType) {
    case "ec2":
    case "vm":
    case "compute":
      configuration.instanceType = getRandomItem(["t3.micro", "t3.small", "t3.medium", "m5.large", "c5.xlarge"])
      configuration.vCPUs = getRandomNumber(1, 16)
      configuration.memory = getRandomNumber(1, 64)
      configuration.os = getRandomItem(["Linux", "Windows"])
      break

    case "rds":
    case "sql":
      configuration.instanceType = getRandomItem(["db.t3.micro", "db.t3.small", "db.m5.large", "db.r5.xlarge"])
      configuration.engine = getRandomItem(["mysql", "postgres", "sqlserver", "oracle"])
      configuration.version = getRandomItem(["5.7", "8.0", "11", "12", "19c"])
      configuration.storage = getRandomNumber(20, 1000)
      configuration.multiAZ = getRandomBoolean(0.3)
      break

    case "s3":
    case "storage":
      configuration.bucketType = getRandomItem(["Standard", "Infrequent Access", "Glacier", "Deep Archive"])
      configuration.objectCount = getRandomNumber(100, 1000000)
      configuration.totalSize = getRandomNumber(1, 10000)
      break

    case "lambda":
    case "function":
      configuration.runtime = getRandomItem(["nodejs16.x", "python3.9", "java11", "go1.x", "dotnet6"])
      configuration.memory = getRandomNumber(128, 3008)
      configuration.timeout = getRandomNumber(3, 900)
      configuration.concurrency = getRandomNumber(10, 1000)
      break

    default:
      // Generic configuration for other resource types
      configuration.size = getRandomItem(["small", "medium", "large", "xlarge"])
      configuration.tier = getRandomItem(["basic", "standard", "premium"])
  }

  // Generate metrics
  const metrics = {
    cpu: {
      average: utilization,
      peak: Math.min(100, utilization + getRandomNumber(5, 30)),
      datapoints: Array.from({ length: 24 }).map(() => ({
        timestamp: new Date(Date.now() - getRandomNumber(0, 24 * 60 * 60 * 1000)),
        value: Math.max(0, utilization + getRandomNumber(-10, 10)),
      })),
    },
    memory: {
      average: getRandomNumber(20, 90),
      peak: getRandomNumber(50, 100),
    },
    network: {
      inbound: getRandomNumber(10, 1000),
      outbound: getRandomNumber(10, 1000),
    },
  }

  return {
    id: uuidv4(),
    provider,
    accountId,
    resourceId,
    resourceName,
    resourceType,
    region,
    status,
    createdAt,
    lastUpdatedAt,
    tags,
    metrics,
    configuration,
    cost,
    costPerMonth,
    utilization,
    lastSyncedAt: new Date(),
    metadata: {},
  }
}

/**
 * Generate multiple mock resources
 */
export function generateMockResources(count = 50) {
  const resources = []

  for (let i = 0; i < count; i++) {
    const provider = getRandomItem(["aws", "azure", "gcp"])
    const accountId = `account-${getRandomNumber(1, 5)}`

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
export function getResourcesByProvider(provider) {
  return mockResources.filter((resource) => resource.provider === provider)
}

/**
 * Get resources by account
 */
export function getResourcesByAccount(accountId) {
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
  const counts = {}

  mockResources.forEach((resource) => {
    const key = `${resource.provider}-${resource.resourceType}`
    counts[key] = (counts[key] || 0) + 1
  })

  return Object.entries(counts).map(([key, count]) => {
    const [provider, resourceType] = key.split("-")
    return { provider, resourceType, count }
  })
}
