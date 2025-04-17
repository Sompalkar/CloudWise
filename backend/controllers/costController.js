import models from "../models/index.js"
import { Op } from "sequelize"

/**
 * Get total cost across all accounts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getTotalCost = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy } = req.query

    // Set default date range if not provided
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end)
    start.setDate(start.getDate() - 30) // Default to 30 days

    // Format dates for query
    const formattedEndDate = end.toISOString().split("T")[0]
    const formattedStartDate = start.toISOString().split("T")[0]

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

    // Query cost data
    let costData

    if (groupBy === "provider") {
      // Group by provider
      costData = await models.CostData.findAll({
        attributes: ["provider", [models.sequelize.fn("SUM", models.sequelize.col("cost")), "totalCost"]],
        where: {
          [Op.or]: [
            { provider: "aws", accountId: { [Op.in]: awsAccountIds } },
            { provider: "azure", accountId: { [Op.in]: azureAccountIds } },
            { provider: "gcp", accountId: { [Op.in]: gcpAccountIds } },
          ],
          date: {
            [Op.between]: [formattedStartDate, formattedEndDate],
          },
        },
        group: ["provider"],
        order: [[models.sequelize.fn("SUM", models.sequelize.col("cost")), "DESC"]],
      })

      costData = costData.map((item) => ({
        provider: item.provider,
        cost: Number.parseFloat(item.getDataValue("totalCost")),
      }))
    } else if (groupBy === "service") {
      // Group by service
      costData = await models.CostData.findAll({
        attributes: ["provider", "service", [models.sequelize.fn("SUM", models.sequelize.col("cost")), "totalCost"]],
        where: {
          [Op.or]: [
            { provider: "aws", accountId: { [Op.in]: awsAccountIds } },
            { provider: "azure", accountId: { [Op.in]: azureAccountIds } },
            { provider: "gcp", accountId: { [Op.in]: gcpAccountIds } },
          ],
          date: {
            [Op.between]: [formattedStartDate, formattedEndDate],
          },
        },
        group: ["provider", "service"],
        order: [[models.sequelize.fn("SUM", models.sequelize.col("cost")), "DESC"]],
      })

      costData = costData.map((item) => ({
        provider: item.provider,
        service: item.service,
        cost: Number.parseFloat(item.getDataValue("totalCost")),
      }))
    } else {
      // Group by date
      costData = await models.CostData.findAll({
        attributes: ["date", "provider", [models.sequelize.fn("SUM", models.sequelize.col("cost")), "totalCost"]],
        where: {
          [Op.or]: [
            { provider: "aws", accountId: { [Op.in]: awsAccountIds } },
            { provider: "azure", accountId: { [Op.in]: azureAccountIds } },
            { provider: "gcp", accountId: { [Op.in]: gcpAccountIds } },
          ],
          date: {
            [Op.between]: [formattedStartDate, formattedEndDate],
          },
        },
        group: ["date", "provider"],
        order: [["date", "ASC"]],
      })

      // Transform data for time series
      const dateMap = new Map()

      costData.forEach((item) => {
        const date = item.date
        const provider = item.provider
        const cost = Number.parseFloat(item.getDataValue("totalCost"))

        if (!dateMap.has(date)) {
          dateMap.set(date, { date, aws: 0, azure: 0, gcp: 0 })
        }

        dateMap.get(date)[provider] = cost
      })

      costData = Array.from(dateMap.values())
      costData.sort((a, b) => new Date(a.date) - new Date(b.date))
    }

    // Calculate total cost
    let totalCost = 0

    if (groupBy === "provider" || groupBy === "service") {
      totalCost = costData.reduce((sum, item) => sum + item.cost, 0)
    } else {
      totalCost = costData.reduce((sum, item) => sum + item.aws + item.azure + item.gcp, 0)
    }

    res.json({
      totalCost,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      data: costData,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get cost forecast
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getCostForecast = async (req, res, next) => {
  try {
    // Get current month's cost data
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Format dates for query
    const formattedToday = today.toISOString().split("T")[0]
    const formattedFirstDay = firstDayOfMonth.toISOString().split("T")[0]

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

    // Query current month's cost data
    const currentMonthCost = await models.CostData.findAll({
      attributes: [[models.sequelize.fn("SUM", models.sequelize.col("cost")), "totalCost"]],
      where: {
        [Op.or]: [
          { provider: "aws", accountId: { [Op.in]: awsAccountIds } },
          { provider: "azure", accountId: { [Op.in]: azureAccountIds } },
          { provider: "gcp", accountId: { [Op.in]: gcpAccountIds } },
        ],
        date: {
          [Op.between]: [formattedFirstDay, formattedToday],
        },
      },
    })

    // Calculate daily average cost
    const totalCost = Number.parseFloat(currentMonthCost[0].getDataValue("totalCost") || 0)
    const daysPassed = today.getDate()
    const dailyAverage = daysPassed > 0 ? totalCost / daysPassed : 0

    // Calculate days remaining in month
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()
    const daysRemaining = daysInMonth - daysPassed

    // Calculate projected cost
    const projectedAdditionalCost = dailyAverage * daysRemaining
    const projectedTotalCost = totalCost + projectedAdditionalCost

    // Get previous month's cost for comparison
    const firstDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0)

    const formattedFirstDayPrev = firstDayOfPrevMonth.toISOString().split("T")[0]
    const formattedLastDayPrev = lastDayOfPrevMonth.toISOString().split("T")[0]

    const previousMonthCost = await models.CostData.findAll({
      attributes: [[models.sequelize.fn("SUM", models.sequelize.col("cost")), "totalCost"]],
      where: {
        [Op.or]: [
          { provider: "aws", accountId: { [Op.in]: awsAccountIds } },
          { provider: "azure", accountId: { [Op.in]: azureAccountIds } },
          { provider: "gcp", accountId: { [Op.in]: gcpAccountIds } },
        ],
        date: {
          [Op.between]: [formattedFirstDayPrev, formattedLastDayPrev],
        },
      },
    })

    const prevMonthTotal = Number.parseFloat(previousMonthCost[0].getDataValue("totalCost") || 0)

    // Calculate month-over-month change
    const changeAmount = projectedTotalCost - prevMonthTotal
    const changePercentage = prevMonthTotal > 0 ? (changeAmount / prevMonthTotal) * 100 : 0

    res.json({
      currentCost: totalCost,
      projectedCost: projectedTotalCost,
      previousMonthCost: prevMonthTotal,
      changeAmount,
      changePercentage,
      dailyAverage,
      daysInMonth,
      daysPassed,
      daysRemaining,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get cost breakdown by account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getCostByAccount = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    // Set default date range if not provided
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end)
    start.setDate(start.getDate() - 30) // Default to 30 days

    // Format dates for query
    const formattedEndDate = end.toISOString().split("T")[0]
    const formattedStartDate = start.toISOString().split("T")[0]

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

    // Prepare result array
    const result = []

    // Process AWS accounts
    for (const account of awsAccounts) {
      const costData = await models.CostData.findAll({
        attributes: [[models.sequelize.fn("SUM", models.sequelize.col("cost")), "totalCost"]],
        where: {
          provider: "aws",
          accountId: account.id,
          date: {
            [Op.between]: [formattedStartDate, formattedEndDate],
          },
        },
      })

      const totalCost = Number.parseFloat(costData[0].getDataValue("totalCost") || 0)

      result.push({
        id: account.id,
        name: account.name,
        provider: "aws",
        accountId: account.accountId,
        cost: totalCost,
      })
    }

    // Process Azure accounts
    for (const account of azureAccounts) {
      const costData = await models.CostData.findAll({
        attributes: [[models.sequelize.fn("SUM", models.sequelize.col("cost")), "totalCost"]],
        where: {
          provider: "azure",
          accountId: account.id,
          date: {
            [Op.between]: [formattedStartDate, formattedEndDate],
          },
        },
      })

      const totalCost = Number.parseFloat(costData[0].getDataValue("totalCost") || 0)

      result.push({
        id: account.id,
        name: account.name,
        provider: "azure",
        accountId: account.subscriptionId,
        cost: totalCost,
      })
    }

    // Process GCP accounts
    for (const account of gcpAccounts) {
      const costData = await models.CostData.findAll({
        attributes: [[models.sequelize.fn("SUM", models.sequelize.col("cost")), "totalCost"]],
        where: {
          provider: "gcp",
          accountId: account.id,
          date: {
            [Op.between]: [formattedStartDate, formattedEndDate],
          },
        },
      })

      const totalCost = Number.parseFloat(costData[0].getDataValue("totalCost") || 0)

      result.push({
        id: account.id,
        name: account.name,
        provider: "gcp",
        accountId: account.projectId,
        cost: totalCost,
      })
    }

    // Sort by cost (descending)
    result.sort((a, b) => b.cost - a.cost)

    res.json({
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      accounts: result,
    })
  } catch (error) {
    next(error)
  }
}
