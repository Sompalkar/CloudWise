import express from "express"
import { getTotalCost, getCostForecast, getCostByAccount } from "../controllers/costController.js"
import { jwtCheck, attachUser } from "../middleware/auth.js"

const router = express.Router()

// Apply JWT check and attach user middleware to all routes
router.use(jwtCheck)
router.use(attachUser)

// Cost routes
router.get("/total", getTotalCost)
router.get("/forecast", getCostForecast)
router.get("/by-account", getCostByAccount)

export default router
