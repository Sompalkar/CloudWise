import express from "express"
import {
  connectAwsAccount,
  getAwsAccounts,
  getAwsAccount,
  updateAwsAccount,
  deleteAwsAccount,
  syncAwsAccount,
  getAwsCostData,
  getAwsResources,
  getAwsRecommendations,
} from "../controllers/awsController.js"
import { jwtCheck, attachUser, hasAccountAccess } from "../middleware/auth.js"

const router = express.Router()

// Apply JWT check and attach user middleware to all routes
router.use(jwtCheck)
router.use(attachUser)

// AWS account management
router.post("/accounts", connectAwsAccount)
router.get("/accounts", getAwsAccounts)
router.get("/accounts/:accountId", hasAccountAccess("aws"), getAwsAccount)
router.put("/accounts/:accountId", hasAccountAccess("aws"), updateAwsAccount)
router.delete("/accounts/:accountId", hasAccountAccess("aws"), deleteAwsAccount)

// AWS data sync
router.post("/accounts/:accountId/sync", hasAccountAccess("aws"), syncAwsAccount)

// AWS cost data
router.get("/accounts/:accountId/costs", hasAccountAccess("aws"), getAwsCostData)

// AWS resources
router.get("/accounts/:accountId/resources", hasAccountAccess("aws"), getAwsResources)

// AWS recommendations
router.get("/accounts/:accountId/recommendations", hasAccountAccess("aws"), getAwsRecommendations)

export default router
