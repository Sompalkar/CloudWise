import { logger } from "./logger.js"

/**
 * Sets up Socket.IO server
 * @param {Object} io - Socket.IO server instance
 */
export const setupSocketIO = (io) => {
  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error("Authentication error: Token required"))
    }

    // Validate token (simplified for now)
    // In production, you would verify the JWT token
    socket.user = { id: "user-id" } // Replace with actual user data
    next()
  })

  // Connection handler
  io.on("connection", (socket) => {
    const userId = socket.user?.id
    logger.info(`User connected: ${userId}`)

    // Join user to their own room for private messages
    socket.join(`user:${userId}`)

    // Handle disconnection
    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${userId}`)
    })

    // Handle errors
    socket.on("error", (error) => {
      logger.error(`Socket error for user ${userId}:`, error)
    })
  })

  return io
}

/**
 * Sends an alert to a specific user
 * @param {Object} io - Socket.IO server instance
 * @param {string} userId - User ID to send alert to
 * @param {Object} alert - Alert data
 */
export const sendAlertToUser = (io, userId, alert) => {
  io.to(`user:${userId}`).emit("alert", alert)
  logger.info(`Alert sent to user ${userId}:`, { alertId: alert.id })
}

/**
 * Sends a notification to a specific user
 * @param {Object} io - Socket.IO server instance
 * @param {string} userId - User ID to send notification to
 * @param {Object} notification - Notification data
 */
export const sendNotificationToUser = (io, userId, notification) => {
  io.to(`user:${userId}`).emit("notification", notification)
  logger.info(`Notification sent to user ${userId}:`, { type: notification.type })
}

/**
 * Broadcasts a message to all connected clients
 * @param {Object} io - Socket.IO server instance
 * @param {string} event - Event name
 * @param {Object} data - Data to broadcast
 */
export const broadcastMessage = (io, event, data) => {
  io.emit(event, data)
  logger.info(`Broadcast message sent:`, { event })
}
