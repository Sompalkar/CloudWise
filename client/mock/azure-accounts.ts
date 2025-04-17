/**
 * Mock Azure account data
 */

export interface AzureAccount {
    id: string
    userId: string
    name: string
    tenantId: string
    subscriptionId: string
    status: "connected" | "error" | "pending"
    lastSync?: string
    errorMessage?: string
    createdAt: string
    updatedAt: string
  }
  
  export const mockAzureAccounts: AzureAccount[] = [
    {
      id: "azure-1",
      userId: "user-1",
      name: "Production Azure",
      tenantId: "11111111-1111-1111-1111-111111111111",
      subscriptionId: "22222222-2222-2222-2222-222222222222",
      status: "connected",
      lastSync: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "azure-2",
      userId: "user-2",
      name: "Development Azure",
      tenantId: "33333333-3333-3333-3333-333333333333",
      subscriptionId: "44444444-4444-4444-4444-444444444444",
      status: "connected",
      lastSync: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "azure-3",
      userId: "user-3",
      name: "Testing Azure",
      tenantId: "55555555-5555-5555-5555-555555555555",
      subscriptionId: "66666666-6666-6666-6666-666666666666",
      status: "error",
      lastSync: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      errorMessage: "Invalid client credentials",
      createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
  
  /**
   * Get Azure accounts for a specific user
   */
  export function getMockAzureAccountsByUserId(userId: string): AzureAccount[] {
    return mockAzureAccounts.filter((account) => account.userId === userId)
  }
  
  /**
   * Get an Azure account by ID
   */
  export function getMockAzureAccount(id: string): AzureAccount | undefined {
    return mockAzureAccounts.find((account) => account.id === id)
  }
  