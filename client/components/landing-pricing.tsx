"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Switch } from "./ui/switch"
import { Badge } from "./ui/badge"
import { Check, HelpCircle } from "lucide-react"
import { TooltipProvider } from "./ui/tooltip"

export function LandingPricing() {
  const [annual, setAnnual] = useState(true)

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams and startups",
      price: annual ? 49 : 59,
      features: [
        "Up to 5 cloud accounts",
        "Cost optimization recommendations",
        "Basic anomaly detection",
        "7-day data retention",
        "Email support",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Professional",
      description: "For growing businesses with multiple cloud accounts",
      price: annual ? 99 : 119,
      features: [
        "Up to 15 cloud accounts",
        "Advanced cost optimization",
        "Real-time anomaly detection",
        "30-day data retention",
        "Priority email support",
        "Custom dashboards",
        "Scheduled reports",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations with complex cloud infrastructure",
      price: "Custom",
      features: [
        "Unlimited cloud accounts",
        "Advanced cost optimization",
        "Real-time anomaly detection",
        "90-day data retention",
        "24/7 dedicated support",
        "Custom dashboards",
        "Scheduled reports",
        "API access",
        "SSO integration",
        "Custom contract",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6 ">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Simple, <span className="gradient-heading">transparent pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground mx-auto max-w-3xl">
            Choose the plan that works best for your organization. All plans include a 14-day free trial.
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${!annual ? "text-muted-foreground" : ""}`}>Monthly</span>
            <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Toggle annual billing" />
            <span className={`text-sm font-medium ${annual ? "text-muted-foreground" : ""}`}>
              Annual
              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>

        <div className="grid gap-8 pt-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative ${plan.popular ? "md:-mt-8" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              <Card className={`h-full flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    {typeof plan.price === "number" ? (
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground ml-1">/month</span>
                      </div>
                    ) : (
                      <div className="text-4xl font-bold">{plan.price}</div>
                    )}
                    {annual && typeof plan.price === "number" && (
                      <p className="text-sm text-muted-foreground mt-1">Billed annually (${plan.price * 12}/year)</p>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className={`w-full ${plan.popular ? "bg-primary" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    <Link href={plan.name === "Enterprise" ? "/contact" : "/auth/register"}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto text-left">
            <TooltipProvider>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">How does the 14-day free trial work?</h4>
                    <p className="text-sm text-muted-foreground">
                      You can try CloudWise for 14 days with full access to all features. No credit card required.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Can I change plans later?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing
                      cycle.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">What payment methods do you accept?</h4>
                    <p className="text-sm text-muted-foreground">
                      We accept all major credit cards, PayPal, and wire transfers for annual plans.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Do you offer a money-back guarantee?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.
                    </p>
                  </div>
                </div>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </section>
  )
}
