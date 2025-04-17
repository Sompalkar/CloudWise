import express from "express"
import {
  getAllResources,
  getResource,
  getResourceMetrics,
  getResourceTags,
  updateResourceTags,
  getIdleResources,
  getResourceCountByType,
} from "../controllers/resourceController.js"
import { jwtCheck, attachUser } from "../middleware/auth.js"

const router = express.Router()

// Apply JWT check and attach user middleware to all routes
router.use(jwtCheck)
router.use(attachUser)

// Resource routes
router.get("/", getAllResources)
router.get("/idle", getIdleResources)
router.get("/count-by-type", getResourceCountByType)
router.get("/:id", getResource)
router.get("/:id/metrics", getResourceMetrics)
router.get("/:id/tags", getResourceTags)
router.put("/:id/tags", updateResourceTags)

export default router
