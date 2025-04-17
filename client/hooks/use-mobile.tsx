"use client"

import { useEffect, useState } from "react"

/**
 * Custom hook to detect if the current viewport is mobile
 * @param breakpoint - The breakpoint to consider as mobile (default: 768px)
 * @returns boolean indicating if the viewport is mobile
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === "undefined") {
      return
    }

    // Initial check
    setIsMobile(window.innerWidth < breakpoint)

    // Handler for window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [breakpoint])

  return isMobile
}
