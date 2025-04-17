/**
 * Mock data index file
 * Exports all mock data for easy importing
 */

export * from "./users"
export * from "./aws-accounts"
export * from "./azure-accounts"
export * from "./gcp-accounts"
export * from "./cost-data"
export * from "./resources"
export * from "./recommendations"
export * from "./alerts"

/**
 * Helper function to generate random data
 */
export const random = {
  /**
   * Generate a random number between min and max
   */
  number: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
  
  /**
   * Generate a random item from an array
   */
  item: <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)],
  
  /**
   * Generate a random boolean with a given probability
   */
  boolean: (probability = 0.5) => Math.random() < probability,
  
  /**
   * Generate a random date between start and end
   */
  date: (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  },
  
  /**
   * Generate a random ID
   */
  id: () => Math.random().toString(36).substring(2, 15),
  
  /**
   * Generate a random UUID
   */
  uuid: () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}
