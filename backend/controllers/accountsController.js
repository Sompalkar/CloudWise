import models from "../models/index.js"
import { NotFoundError } from "../middleware/errorHandler.js"
import { logger } from "../utils/logger.js"

/**
 * Get all cloud accounts for the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAllAccounts = async (req, res, next) => {
  try {
    // Get AWS accounts
    const awsAccounts = await models.AwsAccount.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    })

    // Get Azure accounts
    const azureAccounts = await models.AzureAccount.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    })

    // Get GCP accounts
    const gcpAccounts = await models.GcpAccount.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    })

    // Format accounts
    const formattedAwsAccounts = awsAccounts.map((account) => ({
      id: account.id,
      name: account.name,
      provider: "aws",
      accountId: account.accountId,
      status: account.status,
      lastSync: account.lastSync,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }))

    const formattedAzureAccounts = azureAccounts.map((account) => ({
      id: account.id,
      name: account.name,
      provider: "azure",
      accountId: account.subscriptionId,
      status: account.status,
      lastSync: account.lastSync,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }))

    const formattedGcpAccounts = gcpAccounts.map((account) => ({
      id: account.id,
      name: account.name,
      provider: "gcp",
      accountId: account.projectId,
      status: account.status,
      lastSync: account.lastSync,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }))

    // Combine all accounts
    const allAccounts = [...formattedAwsAccounts, ...formattedAzureAccounts, ...formattedGcpAccounts]

    res.json(allAccounts)
  } catch (error) {
    logger.error("Error getting all accounts:", error)
    next(error)
  }
}

/**
 * Get account details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAccountDetails = async (req, res, next) => {
  try {
    const { id } = req.params
    const { provider } = req.query

    let account

    // Find account based on provider
    switch (provider) {
      case "aws":
        account = await models.AwsAccount.findOne({
          where: { id, userId: req.user.id },
        })
        break
      case "azure":
        account = await models.AzureAccount.findOne({
          where: { id, userId: req.user.id },
        })
        break
      case "gcp":
        account = await models.GcpAccount.findOne({
          where: { id, userId: req.user.id },
        })
        break
      default:
        // Try to find in any provider if not specified
        account = await models.AwsAccount.findOne({
          where: { id, userId: req.user.id },
        })

        if (!account) {
          account = await models.AzureAccount.findOne({
            where: { id, userId: req.user.id },
          })
        }

        if (!account) {
          account = await models.GcpAccount.findOne({
            where: { id, userId: req.user.id },
          })
        }
    }

    if (!account) {
      throw new NotFoundError("Account not found")
    }

    res.json(account)
  } catch (error) {
    logger.error("Error getting account details:", error)
    next(error)
  }
}

/**
 * Delete an account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteAccount = async (req, res, next) => {
  try {
    const { id } = req.params
    const { provider } = req.query

    let account
    let deleted = false

    // Find and delete account based on provider
    switch (provider) {
      case "aws":
        account = await models.AwsAccount.findOne({
          where: { id, userId: req.user.id },
        })
        if (account) {
          await account.destroy()
          deleted = true
        }
        break
      case "azure":
        account = await models.AzureAccount.findOne({
          where: { id, userId: req.user.id },
        })
        if (account) {
          await account.destroy()
          deleted = true
        }
        break
      case "gcp":
        account = await models.GcpAccount.findOne({
          where: { id, userId: req.user.id },
        })
        if (account) {
          await account.destroy()
          deleted = true
        }
        break
      default:
        // Try to delete from any provider if not specified
        account = await models.AwsAccount.findOne({
          where: { id, userId: req.user.id },
        })

        if (account) {
          await account.destroy()
          deleted = true
        } else {
          account = await models.AzureAccount.findOne({
            where: { id, userId: req.user.id },
          })

          if (account) {
            await account.destroy()
            deleted = true
          } else {
            account = await models.GcpAccount.findOne({
              where: { id, userId: req.user.id },
            })

            if (account) {
              await account.destroy()
              deleted = true
            }
          }
        }
    }

    if (!deleted) {
      throw new NotFoundError("Account not found")
    }

    res.status(204).send()
  } catch (error) {
    logger.error("Error deleting account:", error)
    next(error)
  }
}
