/**
 * Mock GCP account data
 */

export interface GcpAccount {
    id: string
    userId: string
    name: string
    projectId: string
    status: "connected" | "error" | "pending"
    lastSync?: string
    errorMessage?: string
    createdAt: string
    updatedAt: string
  }
  
  export const mockGcpAccounts: GcpAccount[] = [
    {
      id: "gcp-1",
      userId: "user-1",
      name: "Production GCP",
      projectId: "cloudwise-prod-123456",
      status: "connected",
      lastSync: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "gcp-2",
      userId: "user-1",
      name: "Analytics GCP",
      projectId: "cloudwise-analytics-654321",
      status: "error",
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      errorMessage: "Service account key is invalid",
      createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "gcp-3",
      userId: "user-3",
      name: "Development GCP",
      projectId: "cloudwise-dev-789012",
      status: "connected",
      lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
  
  /**
   * Get GCP accounts for a specific user
   */
  export function getMockGcpAccountsByUserId(userId: string): GcpAccount[] {
    return mockGcpAccounts.filter((account) => account.userId === userId)
  }
  
  /**
   * Get a GCP account by ID
   */
  export function getMockGcpAccount(id: string): GcpAccount | undefined {
    return mockGcpAccounts.find((account) => account.id === id)
  }
  