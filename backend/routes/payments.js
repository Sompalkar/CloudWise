import express from "express"
import {
  createPaymentIntent,
  createSubscription,
  cancelSubscription,
  getUserSubscriptions,
  getUserPayments,
  handleStripeWebhook,
} from "../controllers/paymentController.js"
import { jwtCheck, attachUser } from "../middleware/auth.js"
import { rawBodyParser } from "../middleware/rawBodyParser.js"

const router = express.Router()

// Webhook route (needs raw body for signature verification)
router.post("/webhook", rawBodyParser, handleStripeWebhook)

// Protected routes
router.use(jwtCheck)
router.use(attachUser)

// Payment routes
router.post("/payment-intent", createPaymentIntent)
router.post("/subscription", createSubscription)
router.post("/subscription/:subscriptionId/cancel", cancelSubscription)
router.get("/subscriptions", getUserSubscriptions)
router.get("/payments", getUserPayments)

export default router
