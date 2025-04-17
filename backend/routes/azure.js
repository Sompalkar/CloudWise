import express from "express"
import { jwtCheck, attachUser, hasAccountAccess } from "../middleware/auth.js"

const router = express.Router()

// Apply JWT check and attach user middleware to all routes
router.use(jwtCheck)
router.use(attachUser)

// Azure account management
router.get("/accounts", (req, res) => {
  // Placeholder for Azure accounts endpoint
  res.json({ message: "Azure accounts endpoint" })
})

router.get("/accounts/:accountId", hasAccountAccess("azure"), (req, res) => {
  // Placeholder for specific Azure account endpoint
  res.json({ message: `Azure account ${req.params.accountId}` })
})

// Add more Azure routes as needed

export default router
