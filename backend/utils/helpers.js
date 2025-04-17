/**
 * Convert a string to a slug
 * @param {string} text - Text to convert
 * @returns {string} - Slug
 */
export const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, "") // Trim - from end of text
  }
  
  /**
   * Format a date
   * @param {Date} date - Date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} - Formatted date
   */
  export const formatDate = (date, options = {}) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    }).format(date)
  }
  
  /**
   * Format currency
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @returns {string} - Formatted currency
   */
  export const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount)
  }
  
  /**
   * Truncate text
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @returns {string} - Truncated text
   */
  export const truncateText = (text, length = 100) => {
    if (text.length <= length) return text
    return text.substring(0, length) + "..."
  }
  
  /**
   * Generate a random string
   * @param {number} length - String length
   * @returns {string} - Random string
   */
  export const generateRandomString = (length = 10) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      result += charset[randomIndex]
    }
    return result
  }
  
  /**
   * Parse query parameters
   * @param {Object} query - Query object
   * @returns {Object} - Parsed query
   */
  export const parseQuery = (query) => {
    const result = {}
    for (const key in query) {
      if (query[key] === "true") {
        result[key] = true
      } else if (query[key] === "false") {
        result[key] = false
      } else if (!isNaN(query[key])) {
        result[key] = Number(query[key])
      } else {
        result[key] = query[key]
      }
    }
    return result
  }
  
  /**
   * Paginate an array
   * @param {Array} array - Array to paginate
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} - Paginated result
   */
  export const paginate = (array, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
  
    const results = {
      results: array.slice(startIndex, endIndex),
      totalCount: array.length,
      page,
      limit,
      totalPages: Math.ceil(array.length / limit),
    }
  
    if (startIndex > 0) {
      results.previousPage = page - 1
    }
  
    if (endIndex < array.length) {
      results.nextPage = page + 1
    }
  
    return results
  }
  