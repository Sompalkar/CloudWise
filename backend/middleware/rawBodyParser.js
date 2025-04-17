/**
 * Middleware to get raw body for Stripe webhook
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const rawBodyParser = (req, res, next) => {
    let data = ""
    req.setEncoding("utf8")
  
    req.on("data", (chunk) => {
      data += chunk
    })
  
    req.on("end", () => {
      req.rawBody = data
      next()
    })
  }
  