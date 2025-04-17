"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "../components/auth-provider"
import { Button } from "../components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export function LandingHero() {
  const { isAuthenticated } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    "AI-powered cost optimization",
    "Multi-cloud support (AWS, Azure, GCP)",
    "Real-time anomaly detection",
    "Actionable recommendations",
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/50 py-20 md:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container relative px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              Cloud Cost Optimization
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="gradient-heading">Optimize</span> your cloud costs with AI
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl">
              CloudWise helps you detect and reduce wasted cloud spend across AWS, Azure, and GCP using AI-driven
              insights.
            </p>
            <motion.ul className="grid gap-3 sm:grid-cols-2" variants={container} initial="hidden" animate="show">
              {features.map((feature) => (
                <motion.li key={feature} className="flex items-center gap-2" variants={item}>
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="w-full sm:w-auto">
                    <Link href="/auth/register">
                      Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">No credit card required. 14-day free trial.</p>
          </motion.div>
          <motion.div
            className="relative mx-auto lg:ml-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative overflow-hidden rounded-lg border bg-background shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5" />
              <img
                src="/images/dashboard-preview.png"
                alt="CloudWise Dashboard"
                className="w-full h-auto"
                width={600}
                height={400}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
