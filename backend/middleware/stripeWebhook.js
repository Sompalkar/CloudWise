import Stripe from "stripe"
import config from "../config/config.js"
import { logger } from "../utils/logger.js"

// Initialize Stripe
const stripe = new Stripe(config.stripe.secretKey)

/**
 * Middleware to handle Stripe webhook events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const handleStripeWebhook = async (req, res, next) => {
  try {
    const sig = req.headers["stripe-signature"]

    if (!sig) {
      return res.status(400).json({ error: "Missing Stripe signature" })
    }

    if (!req.rawBody) {
      return res.status(400).json({ error: "Missing raw body" })
    }

    let event

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, config.stripe.webhookSecret)
    } catch (err) {
      logger.error("Webhook signature verification failed:", err)
      return res.status(400).json({ error: `Webhook Error: ${err.message}` })
    }

    // Set event on request for controller to handle
    req.stripeEvent = event

    next()
  } catch (error) {
    logger.error("Error in Stripe webhook middleware:", error)
    next(error)
  }
}
