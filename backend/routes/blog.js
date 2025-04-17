import express from "express"
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getAllTags,
} from "../controllers/blogController.js"
import { jwtCheck, attachUser } from "../middleware/auth.js"

const router = express.Router()

// Public routes
router.get("/posts", getAllPosts)
router.get("/posts/:slug", getPostBySlug)
router.get("/tags", getAllTags)

// Protected routes
router.use(jwtCheck)
router.use(attachUser)

// Blog post management
router.post("/posts", createPost)
router.put("/posts/:id", updatePost)
router.delete("/posts/:id", deletePost)

export default router
