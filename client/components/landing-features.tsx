"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import {
  BarChart3,
  CloudCog,
  DollarSign,
  Lightbulb,
  LineChart,
  Zap,
  AlertTriangle,
  Clock,
  Shield,
  Gauge,
} from "lucide-react"

export function LandingFeatures() {
  const [activeTab, setActiveTab] = useState("cost-optimization")

  const features = [
    {
      id: "cost-optimization",
      title: "Cost Optimization",
      description: "Identify and eliminate wasted spend across your cloud infrastructure",
      icon: DollarSign,
      color: "text-emerald-500",
      items: [
        {
          title: "Idle Resource Detection",
          description: "Automatically identify unused or underutilized resources",
          icon: Gauge,
        },
        {
          title: "Right-sizing Recommendations",
          description: "Get AI-powered suggestions to optimize instance types and sizes",
          icon: Lightbulb,
        },
        {
          title: "Reserved Instance Planning",
          description: "Optimize your long-term commitments for maximum savings",
          icon: Clock,
        },
      ],
    },
    {
      id: "multi-cloud",
      title: "Multi-Cloud Support",
      description: "Unified visibility and management across AWS, Azure, and Google Cloud",
      icon: CloudCog,
      color: "text-blue-500",
      items: [
        {
          title: "Centralized Dashboard",
          description: "View all your cloud resources in a single, unified interface",
          icon: BarChart3,
        },
        {
          title: "Cross-Cloud Comparison",
          description: "Compare costs and performance across different cloud providers",
          icon: LineChart,
        },
        {
          title: "Seamless Integration",
          description: "Connect your accounts with just a few clicks",
          icon: Zap,
        },
      ],
    },
    {
      id: "anomaly-detection",
      title: "Anomaly Detection",
      description: "Proactively identify unusual spending patterns before they become problems",
      icon: AlertTriangle,
      color: "text-amber-500",
      items: [
        {
          title: "Real-time Monitoring",
          description: "Get instant alerts when spending patterns deviate from normal",
          icon: Clock,
        },
        {
          title: "ML-powered Analysis",
          description: "Advanced algorithms that learn your usage patterns over time",
          icon: Lightbulb,
        },
        {
          title: "Root Cause Analysis",
          description: "Quickly identify the source of unexpected cost increases",
          icon: Shield,
        },
      ],
    },
  ]

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Powerful features to <span className="gradient-heading">optimize your cloud</span>
          </h2>
          <p className="text-xl text-muted-foreground mx-auto max-w-3xl">
            CloudWise combines AI, machine learning, and cloud expertise to help you reduce costs and improve
            efficiency.
          </p>
        </div>

        <Tabs
          defaultValue="cost-optimization"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-4xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-3 mb-12">
            {features.map((feature) => (
              <TabsTrigger key={feature.id} value={feature.id} className="py-3">
                <div className="flex items-center gap-2">
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  <span className="hidden sm:inline">{feature.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="mt-0">
              <div className="grid gap-8 md:grid-cols-3">
                {feature.items.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full card-hover">
                      <CardHeader>
                        <div className={`p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2`}>
                          <item.icon className={`h-6 w-6 ${feature.color}`} />
                        </div>
                        <CardTitle>{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{item.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
