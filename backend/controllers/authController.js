import models from "../models/index.js"
import { BadRequestError, NotFoundError, UnauthorizedError } from "../middleware/errorHandler.js"
import { generateToken } from "../utils/jwt.js"
import { hashPassword, comparePassword } from "../utils/password.js"
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/emailService.js"
import { v4 as uuidv4 } from "uuid"
import cloudinary from "../utils/cloudinary.js"
import config from "../config/config.js"
import fs from 'fs';
import {logger} from "../utils/logger.js";

/**
* Register a new user
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
export const register = async (req, res, next) => {
 try {
   const { email, password, firstName, lastName } = req.body

   if (!email || !password) {
     throw new BadRequestError("Email and password are required")
   }

   // Check if user already exists
   const existingUser = await models.User.findOne({ where: { email } })
   if (existingUser) {
     throw new BadRequestError("User with this email already exists")
   }

   // Hash password
   const hashedPassword = await hashPassword(password)

   // Generate verification token
   const verificationToken = uuidv4()
   const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

   // Create user
   const user = await models.User.create({
     email,
     password: hashedPassword,
     firstName: firstName || "",
     lastName: lastName || "",
     verificationToken,
     verificationExpires,
     isVerified: false,
   })

   // Send verification email
   await sendVerificationEmail(email, verificationToken)

   res.status(201).json({
     message: "User registered successfully. Please check your email to verify your account.",
     userId: user.id,
   })
 } catch (error) {
   next(error)
 }
}

/**
* Verify email
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
export const verifyEmail = async (req, res, next) => {
 try {
   const { token } = req.params

   if (!token) {
     throw new BadRequestError("Verification token is required")
   }

   // Find user with this token
   const user = await models.User.findOne({
     where: {
       verificationToken: token,
       verificationExpires: { [models.sequelize.Op.gt]: new Date() },
     },
   })

   if (!user) {
     throw new BadRequestError("Invalid or expired verification token")
   }

   // Update user
   await user.update({
     isVerified: true,
     verificationToken: null,
     verificationExpires: null,
   })

   res.json({ message: "Email verified successfully. You can now log in." })
 } catch (error) {
   next(error)
 }
}

/**
* Resend verification email
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
export const resendVerificationEmail = async (req, res, next) => {
 try {
   const { email } = req.body

   if (!email) {
     throw new BadRequestError("Email is required")
   }

   // Find user
   const user = await models.User.findOne({ where: { email } })

   if (!user) {
     throw new NotFoundError("User not found")
   }

   if (user.isVerified) {
     return res.json({ message: "Email is already verified" })
   }

   // Generate new verification token
   const verificationToken = uuidv4()
   const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

   // Update user
   await user.update({
     verificationToken,
     verificationExpires,
   })

   // Send verification email
   await sendVerificationEmail(email, verificationToken)

   res.json({ message: "Verification email sent successfully" })
 } catch (error) {
   next(error)
 }
}

/**
* Login user
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
export const login = async (req, res, next) => {
 try {
   const { email, password } = req.body

   if (!email || !password) {
     throw new BadRequestError("Email and password are required")
   }

   // Find user
   const user = await models.User.findOne({ where: { email } })

   if (!user) {
     throw new UnauthorizedError("Invalid credentials")
   }

   // Check if email is verified
   if (!user.isVerified) {
     throw new UnauthorizedError("Please verify your email before logging in")
   }

   // Check password
   const isPasswordValid = await comparePassword(password, user.password)

   if (!isPasswordValid) {
     throw new UnauthorizedError("Invalid credentials")
   }

   // Generate JWT token
   const token = generateToken({ userId: user.id })

   // Update last login
   await user.update({ lastLogin: new Date() })

   res.json({
     token,
     user: {
       id: user.id,
       email: user.email,
       firstName: user.firstName,
       lastName: user.lastName,
       picture: user.picture,
       role: user.role,
     },
   })
 } catch (error) {
   next(error)
 }
}

/**
* Request password reset
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
export const requestPasswordReset = async (req, res, next) => {
 try {
   const { email } = req.body

   if (!email) {
     throw new BadRequestError("Email is required")
   }

   // Find user
   const user = await models.User.findOne({ where: { email } })

   if (!user) {
     // Don't reveal that the user doesn't exist
     return res.json({ message: "If your email is registered, you will receive a password reset link" })
   }

   // Generate reset token
   const resetToken = uuidv4()
   const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

   // Update user
   await user.update({
     resetToken,
     resetExpires,
   })

   // Send password reset email
   await sendPasswordResetEmail(email, resetToken)

   res.json({ message: "If your email is registered, you will receive a password reset link" })
 } catch (error) {
   next(error)
 }
}

/**
* Reset password
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
export const resetPassword = async (req, res, next) => {
 try {
   const { token, password } = req.body

   if (!token || !password) {
     throw new BadRequestError("Token and password are required")
   }

   // Find user with this token
   const user = await models.User.findOne({
     where: {
       resetToken: token,
       resetExpires: { [models.sequelize.Op.gt]: new Date() },
     },
   })

   if (!user) {
     throw new BadRequestError("Invalid or expired reset token")
   }

   // Hash new password
   const hashedPassword = await hashPassword(password)

   // Update user
   await user.update({
     password: hashedPassword,
     resetToken: null,
     resetExpires: null,
   })

   res.json({ message: "Password reset successfully. You can now log in with your new password." })
 } catch (error) {
   next(error)
 }
}

/**
* Get the current user profile
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
export const getProfile = async (req, res, next) => {
 try {
   if (!req.user) {
     throw new NotFoundError("User not found")
   }

   res.json({
     id: req.user.id,
     email: req.user.email,
     firstName: req.user.firstName,
     lastName: req.user.lastName,
     picture: req.user.picture,
     role: req.user.role,
     lastLogin: req.user.lastLogin,
     createdAt: req.user.createdAt,
     updatedAt: req.user.updatedAt,
     profilePicture: req.user.profilePicture, // Include profilePicture
   })
 } catch (error) {
   next(error)
 }
}

/**
* Update the current user profile
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
export const updateProfile = async (req, res, next) => {
 try {
   if (!req.user) {
     throw new NotFoundError("User not found")
   }

   const { firstName, lastName, settings } = req.body

   // Update user
   await req.user.update({
     firstName: firstName !== undefined ? firstName : req.user.firstName,
     lastName: lastName !== undefined ? lastName : req.user.lastName,
     settings: settings !== undefined ? settings : req.user.settings,
   })

   res.json({
     id: req.user.id,
     email: req.user.email,
     firstName: req.user.firstName,
     lastName: req.user.lastName,
     picture: req.user.picture,
     role: req.user.role,
     settings: req.user.settings,
     lastLogin: req.user.lastLogin,
     createdAt: req.user.createdAt,
     updatedAt: req.user.updatedAt,
     profilePicture: req.user.profilePicture, // Include profilePicture
   })
 } catch (error) {
   next(error)
 }
}

/**
* Update user password
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
export const updatePassword = async (req, res, next) => {
 try {
   if (!req.user) {
     throw new NotFoundError("User not found")
   }

   const { currentPassword, newPassword } = req.body

   if (!currentPassword || !newPassword) {
     throw new BadRequestError("Current password and new password are required")
   }

   // Check current password
   const isPasswordValid = await comparePassword(currentPassword, req.user.password)

   if (!isPasswordValid) {
     throw new BadRequestError("Current password is incorrect")
   }

   // Hash new password
   const hashedPassword = await hashPassword(newPassword)

   // Update user
   await req.user.update({ password: hashedPassword })

   res.json({ message: "Password updated successfully" })
 } catch (error) {
   next(error)
 }
}

/**
* Upload profile picture
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
export const uploadProfilePicture = async (req, res, next) => {
 try {
   if (!req.user) {
     throw new NotFoundError("User not found")
   }

   if (!req.file) {
     throw new BadRequestError("No file uploaded")
   }

   // Upload image to Cloudinary
   const result = await cloudinary.uploader.upload(req.file.path, {
     folder: "cloudwise/profile-pictures",
     use_filename: true,
     unique_filename: true,
   })

   // Delete local file after upload
   fs.unlinkSync(req.file.path)

   // Update user
   await req.user.update({ profilePicture: result.secure_url })

   res.json({
     message: "Profile picture uploaded successfully",
     picture: result.secure_url,
   })
 } catch (error) {
   logger.error("Cloudinary error:", error)
   next(error)
 }
}

/**
* Get user settings
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
export const getSettings = async (req, res, next) => {
 try {
   if (!req.user) {
     throw new NotFoundError("User not found")
   }

   res.json(req.user.settings || {})
 } catch (error) {
   next(error)
 }
}

/**
* Update user settings
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
export const updateSettings = async (req, res, next) => {
 try {
   if (!req.user) {
     throw new NotFoundError("User not found")
   }

   const { settings } = req.body

   if (!settings || typeof settings !== "object") {
     throw new BadRequestError("Invalid settings object")
   }

   // Merge existing settings with new settings
   const updatedSettings = {
     ...req.user.settings,
     ...settings,
   }

   // Update user settings
   await req.user.update({ settings: updatedSettings })

   res.json(updatedSettings)
 } catch (error) {
   next(error)
 }
}

/**
* Delete user account
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
*/
export const deleteAccount = async (req, res, next) => {
 try {
   if (!req.user) {
     throw new NotFoundError("User not found")
   }

   // Soft delete user account
   await req.user.destroy()

   res.status(204).send()
 } catch (error) {
   next(error)
 }
}
