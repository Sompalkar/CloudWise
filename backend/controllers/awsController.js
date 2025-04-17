import models from "../models/index.js"
import { logger } from "../utils/logger.js"
import { BadRequestError, NotFoundError } from "../middleware/errorHandler.js"
import { createAwsClients, assumeRole, getCostAndUsage } from "../utils/awsClient.js"
import { io } from "../server.js"
import { sendAlertToUser } from "../utils/socket.js"
import { GetDimensionValuesCommand } from "@aws-sdk/client-cost-explorer"

/**
 * Connect AWS account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const connectAwsAccount = async (req, res, next) => {
  try {
    const { name, accountId, roleArn, externalId, accessKeyId, secretAccessKey, region } = req.body

    if (!name || !accountId) {
      throw new BadRequestError("Name and accountId are required")
    }

    // Check if account already exists
    const existingAccount = await models.AwsAccount.findOne({
      where: {
        userId: req.user.id,
        accountId,
      },
    })

    if (existingAccount) {
      throw new BadRequestError("AWS account already connected")
    }

    // Validate credentials
    let credentials
    let status = "pending"
    let errorMessage = null

    try {
      if (roleArn) {
        // Assume role
        credentials = await assumeRole(roleArn, externalId)
      } else if (accessKeyId && secretAccessKey) {
        // Use access keys
        credentials = { accessKeyId, secretAccessKey, region }
      } else {
        throw new BadRequestError("Either roleArn or accessKeyId/secretAccessKey are required")
      }

      // Test connection
      const clients = createAwsClients(credentials)
      const command = new GetDimensionValuesCommand({
        TimePeriod: {
          Start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          End: new Date().toISOString().split("T")[0],
        },
        Dimension: "SERVICE",
      })
      await clients.costExplorer.send(command)

      status = "connected"
    } catch (error) {
      logger.error("Error validating AWS credentials:", error)
      status = "error"
      errorMessage = error.message
    }

    // Create AWS account
    const awsAccount = await models.AwsAccount.create({
      userId: req.user.id,
      name,
      accountId,
      roleArn,
      externalId,
      accessKeyId,
      secretAccessKey,
      region: region || "us-east-1",
      status,
      errorMessage,
      lastSync: status === "connected" ? new Date() : null,
    })

    // Send alert if connection was successful
    if (status === "connected") {
      const alert = await models.Alert.create({
        userId: req.user.id,
        provider: "aws",
        accountId: awsAccount.id,
        title: "AWS Account Connected",
        message: `AWS account ${name} (${accountId}) has been successfully connected.`,
        severity: "info",
        category: "other",
      })

      sendAlertToUser(io, req.user.id, alert)
    }

    res.status(201).json({
      id: awsAccount.id,
      name: awsAccount.name,
      accountId: awsAccount.accountId,
      region: awsAccount.region,
      status: awsAccount.status,
      lastSync: awsAccount.lastSync,
      createdAt: awsAccount.createdAt,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get all AWS accounts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAwsAccounts = async (req, res, next) => {
  try {
    const accounts = await models.AwsAccount.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    })

    res.json(
      accounts.map((account) => ({
        id: account.id,
        name: account.name,
        accountId: account.accountId,
        region: account.region,
        status: account.status,
        lastSync: account.lastSync,
        createdAt: account.createdAt,
      })),
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get AWS account by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAwsAccount = async (req, res, next) => {
  try {
    const { accountId } = req.params

    const account = await models.AwsAccount.findOne({
      where: {
        id: accountId,
        userId: req.user.id,
      },
    })

    if (!account) {
      throw new NotFoundError("AWS account not found")
    }

    res.json({
      id: account.id,
      name: account.name,
      accountId: account.accountId,
      region: account.region,
      status: account.status,
      lastSync: account.lastSync,
      createdAt: account.createdAt,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update AWS account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateAwsAccount = async (req, res, next) => {
  try {
    const { accountId } = req.params
    const { name, roleArn, externalId, accessKeyId, secretAccessKey, region } = req.body

    const account = await models.AwsAccount.findOne({
      where: {
        id: accountId,
        userId: req.user.id,
      },
    })

    if (!account) {
      throw new NotFoundError("AWS account not found")
    }

    // Validate credentials if provided
    let status = account.status
    let errorMessage = account.errorMessage

    if (roleArn || (accessKeyId && secretAccessKey)) {
      try {
        let credentials

        if (roleArn) {
          // Assume role
          credentials = await assumeRole(roleArn, externalId)
        } else if (accessKeyId && secretAccessKey) {
          // Use access keys
          credentials = {
            accessKeyId,
            secretAccessKey,
            region: region || account.region,
          }
        }

        // Test connection
        const clients = createAwsClients(credentials)
        const command = new GetDimensionValuesCommand({
          TimePeriod: {
            Start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            End: new Date().toISOString().split("T")[0],
          },
          Dimension: "SERVICE",
        })
        await clients.costExplorer.send(command)

        status = "connected"
        errorMessage = null
      } catch (error) {
        logger.error("Error validating AWS credentials:", error)
        status = "error"
        errorMessage = error.message
      }
    }

    // Update account
    await account.update({
      name: name || account.name,
      roleArn: roleArn !== undefined ? roleArn : account.roleArn,
      externalId: externalId !== undefined ? externalId : account.externalId,
      accessKeyId: accessKeyId !== undefined ? accessKeyId : account.accessKeyId,
      secretAccessKey: secretAccessKey !== undefined ? secretAccessKey : account.secretAccessKey,
      region: region || account.region,
      status,
      errorMessage,
      lastSync: status === "connected" ? new Date() : account.lastSync,
    })

    res.json({
      id: account.id,
      name: account.name,
      accountId: account.accountId,
      region: account.region,
      status: account.status,
      lastSync: account.lastSync,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete AWS account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteAwsAccount = async (req, res, next) => {
  try {
    const { accountId } = req.params

    const account = await models.AwsAccount.findOne({
      where: {
        id: accountId,
        userId: req.user.id,
      },
    })

    if (!account) {
      throw new NotFoundError("AWS account not found")
    }

    // Delete account
    await account.destroy()

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

/**
 * Sync AWS account data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const syncAwsAccount = async (req, res, next) => {
  try {
    const { accountId } = req.params

    const account = await models.AwsAccount.findOne({
      where: {
        id: accountId,
        userId: req.user.id,
      },
    })

    if (!account) {
      throw new NotFoundError("AWS account not found")
    }

    // Create AWS clients
    let credentials

    if (account.roleArn) {
      // Assume role
      credentials = await assumeRole(account.roleArn, account.externalId)
    } else if (account.accessKeyId && account.secretAccessKey) {
      // Use access keys
      credentials = {
        accessKeyId: account.accessKeyId,
        secretAccessKey: account.secretAccessKey,
        region: account.region,
      }
    } else {
      throw new BadRequestError("No valid credentials found for this account")
    }

    const clients = createAwsClients(credentials)

    // Sync cost data
    const endDate = new Date().toISOString().split("T")[0]
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    const costData = await getCostAndUsage(clients.costExplorer, startDate, endDate)

    // Process and store cost data
    for (const result of costData.ResultsByTime) {
      const date = result.TimePeriod.Start

      for (const group of result.Groups) {
        const service = group.Keys[0]
        const cost = Number.parseFloat(group.Metrics.UnblendedCost.Amount)
        const usageQuantity = Number.parseFloat(group.Metrics.UsageQuantity.Amount)

        await models.CostData.create({
          provider: "aws",
          accountId: account.id,
          date,
          service,
          cost,
          usageQuantity,
          currency: group.Metrics.UnblendedCost.Unit,
        })
      }
    }

    // Update account last sync time
    await account.update({
      lastSync: new Date(),
      status: "connected",
      errorMessage: null,
    })

    res.json({
      id: account.id,
      name: account.name,
      accountId: account.accountId,
      status: account.status,
      lastSync: account.lastSync,
      message: "Account data synced successfully",
    })
  } catch (error) {
    logger.error("Error syncing AWS account:", error)

    // Update account status
    if (req.params.accountId) {
      const account = await models.AwsAccount.findOne({
        where: {
          id: req.params.accountId,
          userId: req.user.id,
        },
      })

      if (account) {
        await account.update({
          status: "error",
          errorMessage: error.message,
        })
      }
    }

    next(error)
  }
}

/**
 * Get AWS cost data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAwsCostData = async (req, res, next) => {
  try {
    const { accountId } = req.params
    const { startDate, endDate, groupBy } = req.query

    const account = await models.AwsAccount.findOne({
      where: {
        id: accountId,
        userId: req.user.id,
      },
    })

    if (!account) {
      throw new NotFoundError("AWS account not found")
    }

    // Set default date range if not provided
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end)
    start.setDate(start.getDate() - 30) // Default to 30 days

    // Format dates for query
    const formattedEndDate = end.toISOString().split("T")[0]
    const formattedStartDate = start.toISOString().split("T")[0]

    // Query cost data
    let costData

    if (groupBy === "service") {
      // Group by service
      costData = await models.CostData.findAll({
        attributes: ["service", [models.sequelize.fn("SUM", models.sequelize.col("cost")), "totalCost"]],
        where: {
          provider: "aws",
          accountId: account.id,
          date: {
            [models.sequelize.Op.between]: [formattedStartDate, formattedEndDate],
          },
        },
        group: ["service"],
      })
    } else {
      // Group by date
      costData = await models.CostData.findAll({
        attributes: ["date", [models.sequelize.fn("SUM", models.sequelize.col("cost")), "totalCost"]],
        where: {
          provider: "aws",
          accountId: account.id,
          date: {
            [models.sequelize.Op.between]: [formattedStartDate, formattedEndDate],
          },
        },
        group: ["date"],
        order: [["date", "ASC"]],
      })
    }

    res.json(costData)
  } catch (error) {
    next(error)
  }
}

/**
 * Get AWS resources
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAwsResources = async (req, res, next) => {
  try {
    const { accountId } = req.params
    const { resourceType, status } = req.query

    const account = await models.AwsAccount.findOne({
      where: {
        id: accountId,
        userId: req.user.id,
      },
    })

    if (!account) {
      throw new NotFoundError("AWS account not found")
    }

    // Build query
    const query = {
      where: {
        provider: "aws",
        accountId: account.id,
      },
    }

    if (resourceType) {
      query.where.resourceType = resourceType
    }

    if (status) {
      query.where.status = status
    }

    // Query resources
    const resources = await models.Resource.findAll(query)

    res.json(resources)
  } catch (error) {
    next(error)
  }
}

/**
 * Get AWS recommendations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAwsRecommendations = async (req, res, next) => {
  try {
    const { accountId } = req.params
    const { status, impact, type } = req.query

    const account = await models.AwsAccount.findOne({
      where: {
        id: accountId,
        userId: req.user.id,
      },
    })

    if (!account) {
      throw new NotFoundError("AWS account not found")
    }

    // Build query
    const query = {
      where: {
        provider: "aws",
        accountId: account.id,
      },
    }

    if (status) {
      query.where.status = status
    }

    if (impact) {
      query.where.impact = impact
    }

    if (type) {
      query.where.recommendationType = type
    }

    // Query recommendations
    const recommendations = await models.Recommendation.findAll(query)

    res.json(recommendations)
  } catch (error) {
    next(error)
  }
}
