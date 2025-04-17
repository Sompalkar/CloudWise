import jwt from "jsonwebtoken"
import config from "../config/config.js"
import { logger } from "./logger.js"

/**
 * Generate a JWT token
 * @param {Object} payload - Token payload
 * @param {Object} options - Token options
 * @returns {string} - JWT token
 */
export const generateToken = (payload, options = {}) => {
  try {
    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: options.expiresIn || config.jwt.expiresIn,
      ...options,
    })
    return token
  } catch (error) {
    logger.error("Error generating JWT token:", error)
    throw error
  }
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    return decoded
  } catch (error) {
    logger.error("Error verifying JWT token:", error)
    throw error
  }
}

/**
 * Decode a JWT token without verification
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
export const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token)
    return decoded
  } catch (error) {
    logger.error("Error decoding JWT token:", error)
    throw error
  }
}
