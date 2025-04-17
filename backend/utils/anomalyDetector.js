import { logger } from "./logger.js"

/**
 * A simplified anomaly detector that uses statistical methods instead of TensorFlow
 */
export class AnomalyDetector {
  constructor(config = {}) {
    this.threshold = config.threshold || 2.0 // Default threshold for anomaly detection (standard deviations)
  }

  /**
   * Detect anomalies using simple statistical methods
   * @param {Array} data - Array of numerical values
   * @returns {Array} - Anomalies with their scores
   */
  detectAnomalies(data) {
    try {
      // Calculate mean and standard deviation
      const mean = data.reduce((sum, val) => sum + val, 0) / data.length
      const squaredDiffs = data.map((val) => Math.pow(val - mean, 2))
      const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length
      const stdDev = Math.sqrt(variance)

      // Detect anomalies (values more than threshold standard deviations from mean)
      const anomalies = data.map((value, index) => {
        const zScore = Math.abs((value - mean) / stdDev)
        const isAnomaly = zScore > this.threshold

        return {
          index,
          value,
          score: zScore,
          isAnomaly,
        }
      })

      return anomalies
    } catch (error) {
      logger.error("Error detecting anomalies:", error)
      throw error
    }
  }
}

/**
 * Detect anomalies in cost data
 * @param {Array} costData - Array of cost data objects
 * @param {Object} options - Options for anomaly detection
 * @returns {Array} - Anomalies
 */
export const detectCostAnomalies = (costData, options = {}) => {
  try {
    // Extract cost values
    const costs = costData.map((item) => item.cost)

    // Create detector
    const detector = new AnomalyDetector({
      threshold: options.threshold || 2.0,
    })

    // Detect anomalies
    const anomalies = detector.detectAnomalies(costs)

    // Map anomalies back to original data
    return anomalies
      .filter((anomaly) => anomaly.isAnomaly)
      .map((anomaly) => ({
        ...costData[anomaly.index],
        anomalyScore: anomaly.score,
      }))
  } catch (error) {
    logger.error("Error detecting cost anomalies:", error)
    throw error
  }
}

/**
 * Detect resource utilization anomalies
 * @param {Array} utilizationData - Array of utilization data objects
 * @param {Object} options - Options for anomaly detection
 * @returns {Array} - Anomalies
 */
export const detectUtilizationAnomalies = (utilizationData, options = {}) => {
  try {
    // Extract utilization values
    const utilization = utilizationData.map((item) => item.value)

    // Create detector
    const detector = new AnomalyDetector({
      threshold: options.threshold || 2.0,
    })

    // Detect anomalies
    const anomalies = detector.detectAnomalies(utilization)

    // Map anomalies back to original data
    return anomalies
      .filter((anomaly) => anomaly.isAnomaly)
      .map((anomaly) => ({
        ...utilizationData[anomaly.index],
        anomalyScore: anomaly.score,
      }))
  } catch (error) {
    logger.error("Error detecting utilization anomalies:", error)
    throw error
  }
}
