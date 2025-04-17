import models from "../models/index.js"
import { BadRequestError, NotFoundError, ForbiddenError } from "../middleware/errorHandler.js"
import { Op } from "sequelize"
import { logger } from "../utils/logger.js"

/**
 * Get all resources with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAllResources = async (req, res, next) => {
  try {
    const { provider, resourceType, status, region, tag, limit = 50, offset = 0 } = req.query

    // Get all accounts for the user
    const awsAccounts = await models.AwsAccount.findAll({
      where: { userId: req.user.id },
    })

    const azureAccounts = await models.AzureAccount.findAll({
      where: { userId: req.user.id },
    })

    const gcpAccounts = await models.GcpAccount.findAll({
      where: { userId: req.user.id },
    })

    // Get account IDs
    const awsAccountIds = awsAccounts.map((account) => account.id)
    const azureAccountIds = azureAccounts.map((account) => account.id)
    const gcpAccountIds = gcpAccounts.map((account) => account.id)

    // Build query
    const query = {
      where: {
        [Op.or]: [
          { provider: "aws", accountId: { [Op.in]: awsAccountIds } },
          { provider: "azure", accountId: { [Op.in]: azureAccountIds } },
          { provider: "gcp", accountId: { [Op.in]: gcpAccountIds } },
        ],
      },
      order: [["createdAt", "DESC"]],
      limit: Number.parseInt(limit, 10),
      offset: Number.parseInt(offset, 10),
    }

    // Add filters if provided
    if (provider) {
      query.where[Op.or] = [{ provider }]
    }

    if (resourceType) {
      query.where.resourceType = resourceType
    }

    if (status) {
      query.where.status = status
    }

    if (region) {
      query.where.region = region
    }

    // Handle tag filtering
    if (tag) {
      try {
        // Parse tag filter (format: key=value)
        const [tagKey, tagValue] = tag.split("=")

        if (tagKey && tagValue) {
          // This is a simplified approach - in a real database you'd use a more efficient query
          query.where = {
            ...query.where,
            [`tags.${tagKey}`]: tagValue,
          }
        }
      } catch (error) {
        logger.warn(`Invalid tag filter format: ${tag}`)
      }
    }

    // Query resources
    const resources = await models.Resource.findAll(query)

    // Get total count
    const totalCount = await models.Resource.count({
      where: query.where,
    })

    res.json({
      resources,
      totalCount,
      limit: Number.parseInt(limit, 10),
      offset: Number.parseInt(offset, 10),
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get resource by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getResource = async (req, res, next) => {
  try {
    const { id } = req.params

    // Get all accounts for the user
    const awsAccounts = await models.AwsAccount.findAll({
      where: { userId: req.user.id },
    })

    const azureAccounts = await models.AzureAccount.findAll({
      where: { userId: req.user.id },
    })

    const gcpAccounts = await models.GcpAccount.findAll({
      where: { userId: req.user.id },
    })

    // Get account IDs
    const awsAccountIds = awsAccounts.map((account) => account.id)
    const azureAccountIds = azureAccounts.map((account) => account.id)
    const gcpAccountIds = gcpAccounts.map((account) => account.id)

    // Find resource
    const resource = await models.Resource.findOne({
      where: {
        id,
        [Op.or]: [
          { provider: "aws", accountId: { [Op.in]: awsAccountIds } },
          { provider: "azure", accountId: { [Op.in]: azureAccountIds } },
          { provider: "gcp", accountId: { [Op.in]: gcpAccountIds } },
        ],
      },
    })

    if (!resource) {
      throw new NotFoundError("Resource not found")
    }

    // Get associated recommendations
    const recommendations = await models.Recommendation.findAll({
      where: {
        resourceId: resource.resourceId,
        provider: resource.provider,
      },
    })

    // Get cost data
    const costData = await models.CostData.findAll({
      where: {
        resourceId: resource.resourceId,
        provider: resource.provider,
        accountId: resource.accountId,
      },
      order: [["date", "DESC"]],
      limit: 30,
    })

    res.json({
      resource,
      recommendations,
      costData,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get resource metrics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getResourceMetrics = async (req, res, next) => {
  try {
    const { id } = req.params
    const { metric, period, startTime, endTime } = req.query

    if (!metric) {
      throw new BadRequestError("Metric name is required")
    }

    // Find resource
    const resource = await models.Resource.findByPk(id)

    if (!resource) {
      throw new NotFoundError("Resource not found")
    }

    // Check if user has access to this resource
    const hasAccess = await checkResourceAccess(req.user.id, resource)

    if (!hasAccess) {
      throw new ForbiddenError("You do not have access to this resource")
    }

    // Get metrics
    // In a real implementation, this would fetch metrics from the cloud provider's API
    // For now, we'll return mock data
    const now = new Date()
    const start = startTime ? new Date(startTime) : new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const end = endTime ? new Date(endTime) : now

    const metrics = await resource.getMetrics(metric, start, end)

    res.json(metrics)
  } catch (error) {
    next(error)
  }
}

/**
 * Get resource tags
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getResourceTags = async (req, res, next) => {
  try {
    const { id } = req.params

    // Find resource
    const resource = await models.Resource.findByPk(id)

    if (!resource) {
      throw new NotFoundError("Resource not found")
    }

    // Check if user has access to this resource
    const hasAccess = await checkResourceAccess(req.user.id, resource)

    if (!hasAccess) {
      throw new ForbiddenError("You do not have access to this resource")
    }

    res.json(resource.tags || {})
  } catch (error) {
    next(error)
  }
}

/**
 * Update resource tags
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateResourceTags = async (req, res, next) => {
  try {
    const { id } = req.params
    const { tags } = req.body

    if (!tags || typeof tags !== "object") {
      throw new BadRequestError("Tags must be provided as an object")
    }

    // Find resource
    const resource = await models.Resource.findByPk(id)

    if (!resource) {
      throw new NotFoundError("Resource not found")
    }

    // Check if user has access to this resource
    const hasAccess = await checkResourceAccess(req.user.id, resource)

    if (!hasAccess) {
      throw new ForbiddenError("You do not have access to this resource")
    }

    // Update tags
    await resource.updateTags(tags)

    res.json(resource.tags)
  } catch (error) {
    next(error)
  }
}

/**
 * Get idle resources
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getIdleResources = async (req, res, next) => {
  try {
    const { provider, threshold = 10, days = 7 } = req.query

    // Get all accounts for the user
    const awsAccountIds =
      provider === "aws" || !provider
        ? (await models.AwsAccount.findAll({ where: { userId: req.user.id } })).map((a) => a.id)
        : []

    const azureAccountIds =
      provider === "azure" || !provider
        ? (await models.AzureAccount.findAll({ where: { userId: req.user.id } })).map((a) => a.id)
        : []

    const gcpAccountIds =
      provider === "gcp" || !provider
        ? (await models.GcpAccount.findAll({ where: { userId: req.user.id } })).map((a) => a.id)
        : []

    // Build query for idle resources
    const whereClause = {
      utilization: { [Op.lt]: Number(threshold) },
      status: "running",
      [Op.or]: [],
    }

    if (awsAccountIds.length > 0) {
      whereClause[Op.or].push({ provider: "aws", accountId: { [Op.in]: awsAccountIds } })
    }

    if (azureAccountIds.length > 0) {
      whereClause[Op.or].push({ provider: "azure", accountId: { [Op.in]: azureAccountIds } })
    }

    if (gcpAccountIds.length > 0) {
      whereClause[Op.or].push({ provider: "gcp", accountId: { [Op.in]: gcpAccountIds } })
    }

    // If no accounts found, return empty result
    if (whereClause[Op.or].length === 0) {
      return res.json({
        resources: [],
        totalCount: 0,
        potentialSavings: 0,
      })
    }

    // Find idle resources
    const idleResources = await models.Resource.findAll({
      where: whereClause,
      order: [["utilization", "ASC"]],
    })

    // Calculate potential savings
    const potentialSavings = idleResources.reduce((sum, resource) => {
      return sum + (resource.costPerMonth || 0)
    }, 0)

    res.json({
      resources: idleResources,
      totalCount: idleResources.length,
      potentialSavings,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get resource count by type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getResourceCountByType = async (req, res, next) => {
  try {
    const { provider } = req.query

    // Get all accounts for the user
    const awsAccountIds =
      provider === "aws" || !provider
        ? (await models.AwsAccount.findAll({ where: { userId: req.user.id } })).map((a) => a.id)
        : []

    const azureAccountIds =
      provider === "azure" || !provider
        ? (await models.AzureAccount.findAll({ where: { userId: req.user.id } })).map((a) => a.id)
        : []

    const gcpAccountIds =
      provider === "gcp" || !provider
        ? (await models.GcpAccount.findAll({ where: { userId: req.user.id } })).map((a) => a.id)
        : []

    // Build query
    const whereClause = {
      [Op.or]: [],
    }

    if (awsAccountIds.length > 0) {
      whereClause[Op.or].push({ provider: "aws", accountId: { [Op.in]: awsAccountIds } })
    }

    if (azureAccountIds.length > 0) {
      whereClause[Op.or].push({ provider: "azure", accountId: { [Op.in]: azureAccountIds } })
    }

    if (gcpAccountIds.length > 0) {
      whereClause[Op.or].push({ provider: "gcp", accountId: { [Op.in]: gcpAccountIds } })
    }

    // If no accounts found, return empty result
    if (whereClause[Op.or].length === 0) {
      return res.json([])
    }

    // Get resource counts by type
    const resourceCounts = await models.Resource.findAll({
      attributes: [
        "resourceType",
        [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"],
        [models.sequelize.fn("SUM", models.sequelize.col("costPerMonth")), "totalCost"],
      ],
      where: whereClause,
      group: ["resourceType"],
      order: [[models.sequelize.literal("count"), "DESC"]],
    })

    res.json(
      resourceCounts.map((item) => ({
        resourceType: item.resourceType,
        count: Number.parseInt(item.get("count")),
        totalCost: Number.parseFloat(item.get("totalCost") || 0),
      })),
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Helper function to check if a user has access to a resource
 * @param {string} userId - User ID
 * @param {Object} resource - Resource object
 * @returns {Promise<boolean>} - Whether the user has access
 */
async function checkResourceAccess(userId, resource) {
  try {
    switch (resource.provider) {
      case "aws": {
        const account = await models.AwsAccount.findOne({
          where: { id: resource.accountId, userId },
        })
        return !!account
      }
      case "azure": {
        const account = await models.AzureAccount.findOne({
          where: { id: resource.accountId, userId },
        })
        return !!account
      }
      case "gcp": {
        const account = await models.GcpAccount.findOne({
          where: { id: resource.accountId, userId },
        })
        return !!account
      }
      default:
        return false
    }
  } catch (error) {
    logger.error("Error checking resource access:", error)
    return false
  }
}
