import models from "../models/index.js"
import { BadRequestError, NotFoundError } from "../middleware/errorHandler.js"
import { Op } from "sequelize"
import { io } from "../server.js"
import { sendAlertToUser } from "../utils/socket.js"

/**
 * Get all recommendations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAllRecommendations = async (req, res, next) => {
  try {
    const { status, impact, provider, type } = req.query

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
    }

    // Add filters if provided
    if (status) {
      query.where.status = status
    }

    if (impact) {
      query.where.impact = impact
    }

    if (provider) {
      query.where[Op.or] = [{ provider }]
    }

    if (type) {
      query.where.recommendationType = type
    }

    // Query recommendations
    const recommendations = await models.Recommendation.findAll(query)

    // Calculate total potential savings
    const totalSavings = recommendations.reduce((sum, rec) => {
      return sum + (rec.potentialSavings || 0)
    }, 0)

    // Group recommendations by type
    const byType = {}
    recommendations.forEach((rec) => {
      if (!byType[rec.recommendationType]) {
        byType[rec.recommendationType] = []
      }
      byType[rec.recommendationType].push(rec)
    })

    // Group recommendations by impact
    const byImpact = {
      high: recommendations.filter((rec) => rec.impact === "high"),
      medium: recommendations.filter((rec) => rec.impact === "medium"),
      low: recommendations.filter((rec) => rec.impact === "low"),
    }

    res.json({
      totalCount: recommendations.length,
      totalSavings,
      recommendations,
      byType,
      byImpact,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get recommendation by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getRecommendation = async (req, res, next) => {
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

    // Find recommendation
    const recommendation = await models.Recommendation.findOne({
      where: {
        id,
        [Op.or]: [
          { provider: "aws", accountId: { [Op.in]: awsAccountIds } },
          { provider: "azure", accountId: { [Op.in]: azureAccountIds } },
          { provider: "gcp", accountId: { [Op.in]: gcpAccountIds } },
        ],
      },
    })

    if (!recommendation) {
      throw new NotFoundError("Recommendation not found")
    }

    // Get associated resource
    let resource = null
    if (recommendation.resourceId) {
      resource = await models.Resource.findOne({
        where: {
          provider: recommendation.provider,
          resourceId: recommendation.resourceId,
        },
      })
    }

    res.json({
      recommendation,
      resource,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update recommendation status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateRecommendationStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    if (!status || !["open", "in_progress", "implemented", "dismissed", "expired"].includes(status)) {
      throw new BadRequestError("Invalid status")
    }

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

    // Find recommendation
    const recommendation = await models.Recommendation.findOne({
      where: {
        id,
        [Op.or]: [
          { provider: "aws", accountId: { [Op.in]: awsAccountIds } },
          { provider: "azure", accountId: { [Op.in]: azureAccountIds } },
          { provider: "gcp", accountId: { [Op.in]: gcpAccountIds } },
        ],
      },
    })

    if (!recommendation) {
      throw new NotFoundError("Recommendation not found")
    }

    // Update recommendation
    const updatedMetadata = {
      ...recommendation.metadata,
      statusHistory: [
        ...(recommendation.metadata.statusHistory || []),
        {
          status: recommendation.status,
          timestamp: new Date(),
          userId: req.user.id,
        },
      ],
      notes: notes || recommendation.metadata.notes,
    }

    await recommendation.update({
      status,
      metadata: updatedMetadata,
    })

    // Create alert for implemented recommendations
    if (status === "implemented") {
      const alert = await models.Alert.create({
        userId: req.user.id,
        provider: recommendation.provider,
        accountId: recommendation.accountId,
        resourceId: recommendation.resourceId,
        title: "Recommendation Implemented",
        message: `Recommendation "${recommendation.title}" has been implemented, with potential savings of $${recommendation.potentialSavings.toFixed(2)}/month.`,
        severity: "info",
        category: "cost",
        metadata: {
          recommendationId: recommendation.id,
          potentialSavings: recommendation.potentialSavings,
        },
      })

      sendAlertToUser(io, req.user.id, alert)
    }

    res.json(recommendation)
  } catch (error) {
    next(error)
  }
}

/**
 * Get recommendation summary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getRecommendationSummary = async (req, res, next) => {
  try {
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

    // Query recommendations
    const recommendations = await models.Recommendation.findAll({
      where: {
        [Op.or]: [
          { provider: "aws", accountId: { [Op.in]: awsAccountIds } },
          { provider: "azure", accountId: { [Op.in]: azureAccountIds } },
          { provider: "gcp", accountId: { [Op.in]: gcpAccountIds } },
        ],
      },
    })

    // Calculate summary statistics
    const totalCount = recommendations.length
    const openCount = recommendations.filter((rec) => rec.status === "open").length
    const implementedCount = recommendations.filter((rec) => rec.status === "implemented").length
    const dismissedCount = recommendations.filter((rec) => rec.status === "dismissed").length

    const totalPotentialSavings = recommendations.reduce((sum, rec) => {
      return sum + (rec.potentialSavings || 0)
    }, 0)

    const implementedSavings = recommendations
      .filter((rec) => rec.status === "implemented")
      .reduce((sum, rec) => sum + (rec.potentialSavings || 0), 0)

    // Group by type
    const byType = {}
    recommendations.forEach((rec) => {
      if (!byType[rec.recommendationType]) {
        byType[rec.recommendationType] = {
          count: 0,
          savings: 0,
        }
      }
      byType[rec.recommendationType].count++
      byType[rec.recommendationType].savings += rec.potentialSavings || 0
    })

    // Group by provider
    const byProvider = {
      aws: {
        count: recommendations.filter((rec) => rec.provider === "aws").length,
        savings: recommendations
          .filter((rec) => rec.provider === "aws")
          .reduce((sum, rec) => sum + (rec.potentialSavings || 0), 0),
      },
      azure: {
        count: recommendations.filter((rec) => rec.provider === "azure").length,
        savings: recommendations
          .filter((rec) => rec.provider === "azure")
          .reduce((sum, rec) => sum + (rec.potentialSavings || 0), 0),
      },
      gcp: {
        count: recommendations.filter((rec) => rec.provider === "gcp").length,
        savings: recommendations
          .filter((rec) => rec.provider === "gcp")
          .reduce((sum, rec) => sum + (rec.potentialSavings || 0), 0),
      },
    }

    res.json({
      totalCount,
      openCount,
      implementedCount,
      dismissedCount,
      totalPotentialSavings,
      implementedSavings,
      byType,
      byProvider,
    })
  } catch (error) {
    next(error)
  }
}
