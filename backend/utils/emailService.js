import nodemailer from "nodemailer"
import config from "../config/config.js"
import { logger } from "./logger.js"

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

/**
 * Send an email
 * @param {Object} options - Email options
 * @returns {Promise<Object>} - Nodemailer info object
 */
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"CloudWise" <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    }

    const info = await transporter.sendMail(mailOptions)
    logger.info(`Email sent: ${info.messageId}`)
    return info
  } catch (error) {
    logger.error("Error sending email:", error)
    throw error
  }
}

/**
 * Send a verification email
 * @param {string} email - User email
 * @param {string} token - Verification token
 * @returns {Promise<Object>} - Nodemailer info object
 */
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${config.server.frontendUrl}/verify-email?token=${token}`

  return sendEmail({
    to: email,
    subject: "CloudWise - Verify Your Email",
    text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10B981; padding: 20px; text-align: center; color: white;">
          <h1>CloudWise</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #eee; border-top: none;">
          <h2>Verify Your Email</h2>
          <p>Thank you for signing up with CloudWise. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
          </div>
          <p>If the button doesn't work, you can also click on the link below or copy it to your browser:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't sign up for CloudWise, you can safely ignore this email.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>&copy; ${new Date().getFullYear()} CloudWise. All rights reserved.</p>
        </div>
      </div>
    `,
  })
}

/**
 * Send a password reset email
 * @param {string} email - User email
 * @param {string} token - Reset token
 * @returns {Promise<Object>} - Nodemailer info object
 */
export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${config.server.frontendUrl}/reset-password?token=${token}`

  return sendEmail({
    to: email,
    subject: "CloudWise - Reset Your Password",
    text: `You requested a password reset. Please click on the following link to reset your password: ${resetUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10B981; padding: 20px; text-align: center; color: white;">
          <h1>CloudWise</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #eee; border-top: none;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset. Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </div>
          <p>If the button doesn't work, you can also click on the link below or copy it to your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>&copy; ${new Date().getFullYear()} CloudWise. All rights reserved.</p>
        </div>
      </div>
    `,
  })
}
