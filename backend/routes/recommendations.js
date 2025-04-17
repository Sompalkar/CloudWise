import express from "express"
import {
  getAllRecommendations,
  getRecommendation,
  updateRecommendationStatus,
  getRecommendationSummary,
} from "../controllers/recommendationController.js"
import { jwtCheck, attachUser } from "../middleware/auth.js"

const router = express.Router()

// Apply JWT check and attach user middleware to all routes
router.use(jwtCheck)
router.use(attachUser)

// Recommendation routes
router.get("/", getAllRecommendations)
router.get("/summary", getRecommendationSummary)
router.get("/:id", getRecommendation)
router.put("/:id/status", updateRecommendationStatus)

export default router
