import express from "express"
import { jwtCheck, attachUser, hasAccountAccess } from "../middleware/auth.js"

const router = express.Router()

// Apply JWT check and attach user middleware to all routes
router.use(jwtCheck)
router.use(attachUser)

// GCP account management
router.get("/accounts", (req, res) => {
  // Placeholder for GCP accounts endpoint
  res.json({ message: "GCP accounts endpoint" })
})

router.get("/accounts/:accountId", hasAccountAccess("gcp"), (req, res) => {
  // Placeholder for specific GCP account endpoint
  res.json({ message: `GCP account ${req.params.accountId}` })
})

// Add more GCP routes as needed

export default router
