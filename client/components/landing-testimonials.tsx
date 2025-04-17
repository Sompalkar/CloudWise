"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

export function LandingTestimonials() {
  const testimonials = [
    {
      quote:
        "CloudWise helped us reduce our AWS bill by 42% in just two months. The AI recommendations were spot-on and easy to implement.",
      author: "Sarah Johnson",
      role: "CTO at TechNova",
      avatar: "/images/avatars/sarah.jpg",
      company: "TechNova",
    },
    {
      quote:
        "Managing multiple cloud providers used to be a nightmare. With CloudWise, we have complete visibility across AWS, Azure, and GCP in one dashboard.",
      author: "Michael Chen",
      role: "Cloud Infrastructure Lead",
      avatar: "/images/avatars/michael.jpg",
      company: "DataSphere",
    },
    {
      quote:
        "The anomaly detection feature alerted us to an unexpected cost spike from a misconfigured service before it became a major issue. Saved us thousands.",
      author: "Priya Patel",
      role: "DevOps Manager",
      avatar: "/images/avatars/priya.jpg",
      company: "Quantum Solutions",
    },
    {
      quote:
        "As a startup, every dollar counts. CloudWise's recommendations helped us optimize our cloud infrastructure and extend our runway by 3 months.",
      author: "Alex Rodriguez",
      role: "Founder & CEO",
      avatar: "/images/avatars/alex.jpg",
      company: "LaunchPad AI",
    },
  ]

  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay, testimonials.length])

  const next = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Trusted by <span className="gradient-heading">innovative companies</span>
          </h2>
          <p className="text-xl text-muted-foreground mx-auto max-w-3xl">
            See how organizations are using CloudWise to optimize their cloud costs and improve efficiency.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Card className="border-2 border-primary/10 bg-gradient-to-br from-background to-muted/20">
                <CardContent className="pt-10 pb-6 px-6 md:px-10">
                  <Quote className="absolute top-6 left-6 h-8 w-8 text-primary/40" />
                  <blockquote className="text-xl m-0 md:text-2xl font-medium leading-relaxed text-balance">
                    "{testimonials[current].quote}"
                  </blockquote>
                </CardContent>
                <CardFooter className="px-6 pb-6 md:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={testimonials[current].avatar} alt={testimonials[current].author} />
                      <AvatarFallback>
                        {testimonials[current].author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonials[current].author}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonials[current].role}, {testimonials[current].company}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prev}>
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={next}>
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === current ? "bg-primary w-6" : "bg-primary/30"
                }`}
                onClick={() => {
                  setAutoplay(false)
                  setCurrent(index)
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
