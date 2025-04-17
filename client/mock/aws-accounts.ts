/**
 * Mock AWS account data
 */

export interface AwsAccount {
    id: string
    userId: string
    name: string
    accountId: string
    roleArn?: string
    externalId?: string
    region: string
    status: "connected" | "error" | "pending"
    lastSync?: string
    errorMessage?: string
    createdAt: string
    updatedAt: string
  }
  
  export const mockAwsAccounts: AwsAccount[] = [
    {
      id: "aws-1",
      userId: "user-1",
      name: "Production AWS",
      accountId: "123456789012",
      roleArn: "arn:aws:iam::123456789012:role/CloudWiseRole",
      region: "us-east-1",
      status: "connected",
      lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "aws-2",
      userId: "user-1",
      name: "Development AWS",
      accountId: "210987654321",
      roleArn: "arn:aws:iam::210987654321:role/CloudWiseRole",
      region: "us-west-2",
      status: "connected",
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "aws-3",
      userId: "user-2",
      name: "Staging AWS",
      accountId: "987654321098",
      roleArn: "arn:aws:iam::987654321098:role/CloudWiseRole",
      region: "eu-west-1",
      status: "error",
      lastSync: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      errorMessage: "Failed to assume role: Access denied",
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "aws-4",
      userId: "user-3",
      name: "Analytics AWS",
      accountId: "456789012345",
      roleArn: "arn:aws:iam::456789012345:role/CloudWiseRole",
      region: "us-east-2",
      status: "connected",
      lastSync: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
  
  /**
   * Get AWS accounts for a specific user
   */
  export function getMockAwsAccountsByUserId(userId: string): AwsAccount[] {
    return mockAwsAccounts.filter((account) => account.userId === userId)
  }
  
  /**
   * Get an AWS account by ID
   */
  export function getMockAwsAccount(id: string): AwsAccount | undefined {
    return mockAwsAccounts.find((account) => account.id === id)
  }
  