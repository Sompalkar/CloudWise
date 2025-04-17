import multer from "multer"
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import { logger } from "../utils/logger.js"

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads")
if (!fs.existsSync(uploadsDir)) {
 fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
 destination: (req, file, cb) => {
   cb(null, uploadsDir)
 },
 filename: (req, file, cb) => {
   const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
   cb(null, uniqueName)
 },
})

// File filter
const fileFilter = (req, file, cb) => {
 // Accept images, PDFs, and common document formats
 const allowedFileTypes = [
   "image/jpeg",
   "image/png",
   "image/gif",
   "image/webp",
   "application/pdf",
   "application/msword",
   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
   "application/vnd.ms-excel",
   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
 ]

 if (allowedFileTypes.includes(file.mimetype)) {
   cb(null, true)
 } else {
   cb(new Error("Invalid file type. Only images, PDFs, and documents are allowed."), false)
 }
}

// Create multer instance
export const upload = multer({
 storage,
 fileFilter,
 limits: {
   fileSize: 10 * 1024 * 1024, // 10MB
 },
})

// Error handler middleware
export const handleUploadError = (err, req, res, next) => {
 if (err instanceof multer.MulterError) {
   if (err.code === "LIMIT_FILE_SIZE") {
     return res.status(400).json({ error: "File too large. Maximum size is 10MB." })
   }
   return res.status(400).json({ error: err.message })
 } else if (err) {
   logger.error("Upload error:", err)
   return res.status(400).json({ error: err.message })
 }
 next()
}

// Delete file middleware
export const deleteFile = (filePath) => {
 try {
   if (filePath) {
     const fullPath = path.join(process.cwd(), filePath)
     if (fs.existsSync(fullPath)) {
       fs.unlinkSync(fullPath)
       logger.info(`File deleted: ${filePath}`)
     }
   }
 } catch (error) {
   logger.error(`Error deleting file ${filePath}:`, error)
 }
}
