import crypto from "crypto"
import config from "../config/config.js"

// Encryption key derived from the secret
const key = crypto.scryptSync(config.encryption.secret, "salt", 32)
const algorithm = "aes-256-cbc"

/**
 * Encrypts sensitive data
 * @param {string} text - The text to encrypt
 * @returns {string} - The encrypted text
 */
export const encryptData = (text) => {
  if (!text) return null

  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  // Return IV + encrypted data
  return `${iv.toString("hex")}:${encrypted}`
}

/**
 * Decrypts encrypted data
 * @param {string} encryptedText - The encrypted text to decrypt
 * @returns {string} - The decrypted text
 */
export const decryptData = (encryptedText) => {
  if (!encryptedText) return null

  const [ivHex, encryptedHex] = encryptedText.split(":")

  if (!ivHex || !encryptedHex) {
    throw new Error("Invalid encrypted text format")
  }

  const iv = Buffer.from(ivHex, "hex")
  const decipher = crypto.createDecipheriv(algorithm, key, iv)

  let decrypted = decipher.update(encryptedHex, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

/**
 * Hashes a string using SHA-256
 * @param {string} text - The text to hash
 * @returns {string} - The hashed text
 */
export const hashData = (text) => {
  if (!text) return null
  return crypto.createHash("sha256").update(text).digest("hex")
}
