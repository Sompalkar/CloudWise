"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

/**
 * ThemeProvider component that wraps the application to provide theme context
 * Uses next-themes for managing light/dark mode and system preferences
 *
 * @param children - React children components
 * @param props - Additional props for NextThemesProvider
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
