import { logger } from "../utils/logger.js"

export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
  })

  // Handle JWT errors
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired token",
    })
  }

  // Handle validation errors
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
      details: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    })
  }

  // Handle not found errors
  if (err.status === 404 || err.name === "NotFoundError") {
    return res.status(404).json({
      error: "Not Found",
      message: err.message || "Resource not found",
    })
  }

  // Handle forbidden errors
  if (err.status === 403 || err.name === "ForbiddenError") {
    return res.status(403).json({
      error: "Forbidden",
      message: err.message || "Access denied",
    })
  }

  // Handle bad request errors
  if (err.status === 400 || err.name === "BadRequestError") {
    return res.status(400).json({
      error: "Bad Request",
      message: err.message || "Invalid request",
    })
  }

  // Default to 500 server error
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message || "An unexpected error occurred",
  })
}

// Custom error classes
export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message)
    this.name = "NotFoundError"
    this.status = 404
  }
}

export class BadRequestError extends Error {
  constructor(message = "Bad request") {
    super(message)
    this.name = "BadRequestError"
    this.status = 400
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Access denied") {
    super(message)
    this.name = "ForbiddenError"
    this.status = 403
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message)
    this.name = "UnauthorizedError"
    this.status = 401
  }
}
