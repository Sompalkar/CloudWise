"use client"

import Link from "next/link"
import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
import { Button } from "./ui/button"
import { ArrowRight, BarChart3, CloudCog, DollarSign } from "lucide-react"

export function LandingCta() {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/20 p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to optimize your cloud costs?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of companies saving up to 40% on their cloud bills with CloudWise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Reduce Costs</h3>
                <p className="text-sm text-muted-foreground">Save up to 40% on your monthly cloud bills</p>
              </div>

              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CloudCog className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multi-Cloud</h3>
                <p className="text-sm text-muted-foreground">Manage AWS, Azure, and GCP in one place</p>
              </div>

              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
                <p className="text-sm text-muted-foreground">Get actionable recommendations powered by AI</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/auth/register">
                  Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">No credit card required. 14-day free trial. Cancel anytime.</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
