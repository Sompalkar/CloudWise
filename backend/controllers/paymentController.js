import models from "../models/index.js"
import { BadRequestError, NotFoundError } from "../middleware/errorHandler.js"
import Stripe from "stripe"
import config from "../config/config.js"
import { logger } from "../utils/logger.js"

// Initialize Stripe
const stripe = new Stripe(config.stripe.secretKey)

/**
 * Create a Stripe customer
 * @param {Object} user - User object
 * @returns {Promise<string>} - Stripe customer ID
 */
const createStripeCustomer = async (user) => {
  try {
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      metadata: {
        userId: user.id,
      },
    })

    return customer.id
  } catch (error) {
    logger.error("Error creating Stripe customer:", error)
    throw error
  }
}

/**
 * Get or create Stripe customer
 * @param {Object} user - User object
 * @returns {Promise<string>} - Stripe customer ID
 */
const getOrCreateStripeCustomer = async (user) => {
  try {
    // Check if user already has a Stripe customer ID
    const subscription = await models.Subscription.findOne({
      where: { userId: user.id },
    })

    if (subscription && subscription.stripeCustomerId) {
      return subscription.stripeCustomerId
    }

    // Create new Stripe customer
    return createStripeCustomer(user)
  } catch (error) {
    logger.error("Error getting or creating Stripe customer:", error)
    throw error
  }
}

/**
 * Create a payment intent
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = "usd", description } = req.body

    if (!amount) {
      throw new BadRequestError("Amount is required")
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(req.user)

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      description,
      metadata: {
        userId: req.user.id,
      },
    })

    // Create payment record
    const payment = await models.Payment.create({
      userId: req.user.id,
      stripePaymentId: paymentIntent.id,
      amount,
      currency,
      status: "pending",
      description,
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Create a subscription
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createSubscription = async (req, res, next) => {
  try {
    const { plan, paymentMethodId } = req.body

    if (!plan || !paymentMethodId) {
      throw new BadRequestError("Plan and payment method ID are required")
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(req.user)

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    })

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: plan }],
      expand: ["latest_invoice.payment_intent"],
    })

    // Create subscription record
    const subscriptionRecord = await models.Subscription.create({
      userId: req.user.id,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      plan,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    })

    res.json({
      subscriptionId: subscriptionRecord.id,
      status: subscription.status,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Cancel subscription
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const cancelSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params
    const { cancelImmediately = false } = req.body

    // Find subscription
    const subscription = await models.Subscription.findOne({
      where: {
        id: subscriptionId,
        userId: req.user.id,
      },
    })

    if (!subscription) {
      throw new NotFoundError("Subscription not found")
    }

    // Cancel subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: !cancelImmediately,
    })

    if (cancelImmediately) {
      await stripe.subscriptions.del(subscription.stripeSubscriptionId)

      // Update subscription record
      await subscription.update({
        status: "canceled",
        cancelAtPeriodEnd: false,
      })
    } else {
      // Update subscription record
      await subscription.update({
        cancelAtPeriodEnd: true,
      })
    }

    res.json({
      message: cancelImmediately
        ? "Subscription canceled immediately"
        : "Subscription will be canceled at the end of the billing period",
      status: cancelImmediately ? "canceled" : updatedSubscription.status,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get user subscriptions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Find subscriptions
    const subscriptions = await models.Subscription.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    })

    res.json(subscriptions)
  } catch (error) {
    next(error)
  }
}

/**
 * Get user payments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getUserPayments = async (req, res, next) => {
  try {
    // Find payments
    const payments = await models.Payment.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    })

    res.json(payments)
  } catch (error) {
    next(error)
  }
}

/**
 * Handle Stripe webhook
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const handleStripeWebhook = async (req, res, next) => {
  try {
    const sig = req.headers["stripe-signature"]

    let event

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, config.stripe.webhookSecret)
    } catch (err) {
      logger.error("Webhook signature verification failed:", err)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object)
        break
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object)
        break
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object)
        break
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object)
        break
      default:
        logger.info(`Unhandled event type: ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    next(error)
  }
}

/**
 * Handle payment intent succeeded
 * @param {Object} paymentIntent - Stripe payment intent
 */
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    // Update payment record
    await models.Payment.update(
      {
        status: "succeeded",
        paymentMethod: paymentIntent.payment_method,
      },
      {
        where: { stripePaymentId: paymentIntent.id },
      },
    )
  } catch (error) {
    logger.error("Error handling payment intent succeeded:", error)
  }
}

/**
 * Handle payment intent failed
 * @param {Object} paymentIntent - Stripe payment intent
 */
const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    // Update payment record
    await models.Payment.update(
      {
        status: "failed",
        metadata: {
          error: paymentIntent.last_payment_error,
        },
      },
      {
        where: { stripePaymentId: paymentIntent.id },
      },
    )
  } catch (error) {
    logger.error("Error handling payment intent failed:", error)
  }
}

/**
 * Handle subscription updated
 * @param {Object} subscription - Stripe subscription
 */
const handleSubscriptionUpdated = async (subscription) => {
  try {
    // Update subscription record
    await models.Subscription.update(
      {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      {
        where: { stripeSubscriptionId: subscription.id },
      },
    )
  } catch (error) {
    logger.error("Error handling subscription updated:", error)
  }
}

/**
 * Handle subscription deleted
 * @param {Object} subscription - Stripe subscription
 */
const handleSubscriptionDeleted = async (subscription) => {
  try {
    // Update subscription record
    await models.Subscription.update(
      {
        status: "canceled",
      },
      {
        where: { stripeSubscriptionId: subscription.id },
      },
    )
  } catch (error) {
    logger.error("Error handling subscription deleted:", error)
  }
}
