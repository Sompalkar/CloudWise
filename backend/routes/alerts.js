import express from "express"
import {
  getAlerts,
  getAlert,
  updateAlertStatus,
  markAllAsRead,
  deleteAlert,
  getAlertSummary,
} from "../controllers/alertController.js"
import { jwtCheck, attachUser } from "../middleware/auth.js"

const router = express.Router()

// Apply JWT check and attach user middleware to all routes
router.use(jwtCheck)
router.use(attachUser)

// Alert routes
router.get("/", getAlerts)
router.get("/summary", getAlertSummary)
router.post("/mark-all-read", markAllAsRead)
router.get("/:id", getAlert)
router.put("/:id/status", updateAlertStatus)
router.delete("/:id", deleteAlert)

export default router
