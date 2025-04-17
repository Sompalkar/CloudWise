import { expressjwt } from "express-jwt"
import jwksRsa from "jwks-rsa"
import config from "../config/config.js"
import models from "../models/index.js"
import { logger } from "../utils/logger.js"

// Auth0 JWT validation middleware
export const jwtCheck = expressjwt({
 secret: jwksRsa.expressJwtSecret({
   cache: true,
   rateLimit: true,
   jwksRequestsPerMinute: 5,
   jwksUri: `https://${config.auth0.domain}/.well-known/jwks.json`,
 }),
 audience: config.auth0.audience,
 issuer: `https://${config.auth0.domain}/`,
 algorithms: ["RS256"],
})

// Middleware to attach user to request
export const attachUser = async (req, res, next) => {
 try {
   if (!req.auth || !req.auth.sub) {
     return next()
   }

   const auth0Id = req.auth.sub

   // Find or create user
   let user = await models.User.findOne({ where: { auth0Id } })

   if (!user) {
     // If user doesn't exist, create a new one
     user = await models.User.create({
       auth0Id,
       email: req.auth.email || "",
       firstName: req.auth.given_name || "",
       lastName: req.auth.family_name || "",
       picture: req.auth.picture || "",
       lastLogin: new Date(),
     })
     logger.info(`Created new user: ${user.id}`)
   } else {
     // Update last login time
     await user.update({ lastLogin: new Date() })
   }

   // Attach user to request
   req.user = user
   next()
 } catch (error) {
   logger.error("Error attaching user to request:", error)
   next(error)
 }
}

// Check if user is admin
export const isAdmin = (req, res, next) => {
 if (!req.user || req.user.role !== "admin") {
   return res.status(403).json({ error: "Forbidden: Admin access required" })
 }
 next()
}

// Middleware to check if user has access to the specified account
export const hasAccountAccess = (provider) => {
 return async (req, res, next) => {
   try {
     const { accountId } = req.params
     const userId = req.user.id

     let account

     switch (provider) {
       case "aws":
         account = await models.AwsAccount.findOne({
           where: { id: accountId, userId },
         })
         break
       case "azure":
         account = await models.AzureAccount.findOne({
           where: { id: accountId, userId },
         })
         break
       case "gcp":
         account = await models.GcpAccount.findOne({
           where: { id: accountId, userId },
         })
         break
       default:
         return res.status(400).json({ error: "Invalid provider" })
     }

     if (!account) {
       return res.status(403).json({ error: "Forbidden: You do not have access to this account" })
     }

     // Attach account to request
     req.account = account
     next()
   } catch (error) {
     logger.error(`Error checking ${provider} account access:`, error)
     next(error)
   }
 }
}
