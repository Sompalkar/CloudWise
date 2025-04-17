import express from "express"
import { getAllAccounts, getAccountDetails, deleteAccount } from "../controllers/accountsController.js"
import { jwtCheck, attachUser } from "../middleware/auth.js"

const router = express.Router()

// Apply JWT check and attach user middleware to all routes
router.use(jwtCheck)
router.use(attachUser)

// Account routes
router.get("/", getAllAccounts)
router.get("/:id", getAccountDetails)
router.delete("/:id", deleteAccount)

export default router
