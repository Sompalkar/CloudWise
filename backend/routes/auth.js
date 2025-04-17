import express from "express"
import {
 register,
 verifyEmail,
 resendVerificationEmail,
 login,
 requestPasswordReset,
 resetPassword,
 getProfile,
 updateProfile,
 updatePassword,
 uploadProfilePicture,
 getSettings,
 updateSettings,
 deleteAccount,
} from "../controllers/authController.js"
import { jwtCheck, attachUser } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"
import { handleUploadError } from "../middleware/upload.js"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/verify-email/:token", verifyEmail)
router.post("/resend-verification", resendVerificationEmail)
router.post("/login", login)
router.post("/request-password-reset", requestPasswordReset)
router.post("/reset-password", resetPassword)

// Protected routes
router.use(jwtCheck)
router.use(attachUser)

// User profile routes
router.get("/profile", getProfile)
router.put("/profile", updateProfile)
router.put("/password", updatePassword)
router.post("/profile-picture", upload.single("picture"), handleUploadError, uploadProfilePicture)

// User settings routes
router.get("/settings", getSettings)
router.put("/settings", updateSettings)

// Account management
router.delete("/account", deleteAccount)

export default router
