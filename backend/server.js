import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import { createServer } from "http"
import { Server } from "socket.io"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit"
import { sequelize } from "./models/index.js"
import { errorHandler } from "./middleware/errorHandler.js"
import { logger } from "./utils/logger.js"
import { setupSocketIO } from "./utils/socket.js"

// Import routes
import authRoutes from "./routes/auth.js"
import awsRoutes from "./routes/aws.js"
import azureRoutes from "./routes/azure.js"
import gcpRoutes from "./routes/gcp.js"
import costRoutes from "./routes/costs.js"
import recommendationRoutes from "./routes/recommendations.js"
import alertRoutes from "./routes/alerts.js"
import resourceRoutes from "./routes/resources.js"
import blogRoutes from "./routes/blog.js"
import paymentRoutes from "./routes/payments.js"
import accountsRoutes from "./routes/accounts.js"

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// Create HTTP server
const httpServer = createServer(app)

// Set up Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Set up Socket.IO handlers
setupSocketIO(io)

// Middleware
app.use(helmet()) // Security headers
app.use(compression()) // Compress responses
app.use(express.json()) // Parse JSON bodies
app.use(cookieParser()) // Parse cookies
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
})

// Apply rate limiting to all routes
app.use(apiLimiter)

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/aws", awsRoutes)
app.use("/api/azure", azureRoutes)
app.use("/api/gcp", gcpRoutes)
app.use("/api/costs", costRoutes)
app.use("/api/recommendations", recommendationRoutes)
app.use("/api/alerts", alertRoutes)
app.use("/api/resources", resourceRoutes)
app.use("/api/blog", blogRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/accounts", accountsRoutes)

// Serve uploads directory
app.use("/uploads", express.static("uploads"))

// Error handling middleware
app.use(errorHandler)

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate()
    logger.info("Database connection has been established successfully.")

    // Sync database models (in development)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true })
      logger.info("Database models synchronized.")
    }

    // Start server
    httpServer.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })
  } catch (error) {
    logger.error("Unable to connect to the database or start server:", error)
    process.exit(1)
  }
}

startServer()

// Handle graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully")
  httpServer.close(() => {
    logger.info("HTTP server closed")
    sequelize.close().then(() => {
      logger.info("Database connection closed")
      process.exit(0)
    })
  })
})

export { app, io }
