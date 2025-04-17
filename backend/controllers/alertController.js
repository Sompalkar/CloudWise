import models from "../models/index.js"
import { BadRequestError, NotFoundError } from "../middleware/errorHandler.js"

/**
 * Get all alerts for the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAlerts = async (req, res, next) => {
  try {
    const { status, severity, category, limit = 50, offset = 0 } = req.query

    // Build query
    const query = {
      where: {
        userId: req.user.id,
      },
      order: [["createdAt", "DESC"]],
      limit: Number.parseInt(limit, 10),
      offset: Number.parseInt(offset, 10),
    }

    // Add filters if provided
    if (status) {
      query.where.status = status
    }

    if (severity) {
      query.where.severity = severity
    }

    if (category) {
      query.where.category = category
    }

    // Query alerts
    const alerts = await models.Alert.findAll(query)

    // Get total count
    const totalCount = await models.Alert.count({
      where: query.where,
    })

    // Get unread count
    const unreadCount = await models.Alert.count({
      where: {
        ...query.where,
        status: "new",
      },
    })

    res.json({
      alerts,
      totalCount,
      unreadCount,
      limit: Number.parseInt(limit, 10),
      offset: Number.parseInt(offset, 10),
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get alert by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAlert = async (req, res, next) => {
  try {
    const { id } = req.params

    const alert = await models.Alert.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    })

    if (!alert) {
      throw new NotFoundError("Alert not found")
    }

    // If alert is new, mark it as read
    if (alert.status === "new") {
      await alert.update({ status: "read" })
    }

    res.json(alert)
  } catch (error) {
    next(error)
  }
}

/**
 * Update alert status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateAlertStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status || !["read", "acknowledged", "resolved"].includes(status)) {
      throw new BadRequestError("Invalid status")
    }

    const alert = await models.Alert.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    })

    if (!alert) {
      throw new NotFoundError("Alert not found")
    }

    // Update alert status
    await alert.update({
      status,
      resolvedAt: status === "resolved" ? new Date() : null,
    })

    res.json(alert)
  } catch (error) {
    next(error)
  }
}

/**
 * Mark all alerts as read
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    await models.Alert.update(
      { status: "read" },
      {
        where: {
          userId: req.user.id,
          status: "new",
        },
      },
    )

    res.json({
      success: true,
      message: "All alerts marked as read",
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete alert
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteAlert = async (req, res, next) => {
  try {
    const { id } = req.params

    const alert = await models.Alert.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    })

    if (!alert) {
      throw new NotFoundError("Alert not found")
    }

    // Delete alert
    await alert.destroy()

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

/**
 * Get alert summary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAlertSummary = async (req, res, next) => {
  try {
    // Get counts by status
    const statusCounts = await models.Alert.findAll({
      attributes: ["status", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
      where: {
        userId: req.user.id,
      },
      group: ["status"],
    })

    // Get counts by severity
    const severityCounts = await models.Alert.findAll({
      attributes: ["severity", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
      where: {
        userId: req.user.id,
      },
      group: ["severity"],
    })

    // Get counts by category
    const categoryCounts = await models.Alert.findAll({
      attributes: ["category", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
      where: {
        userId: req.user.id,
      },
      group: ["category"],
    })

    // Format results
    const byStatus = {}
    statusCounts.forEach((item) => {
      byStatus[item.status] = Number.parseInt(item.getDataValue("count"), 10)
    })

    const bySeverity = {}
    severityCounts.forEach((item) => {
      bySeverity[item.severity] = Number.parseInt(item.getDataValue("count"), 10)
    })

    const byCategory = {}
    categoryCounts.forEach((item) => {
      byCategory[item.category] = Number.parseInt(item.getDataValue("count"), 10)
    })

    // Get total count
    const totalCount = await models.Alert.count({
      where: {
        userId: req.user.id,
      },
    })

    res.json({
      totalCount,
      byStatus,
      bySeverity,
      byCategory,
    })
  } catch (error) {
    next(error)
  }
}
