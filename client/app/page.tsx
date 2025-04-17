// import { LandingNavbar } from "@/components/landing-navbar"
import { LandingNavbar } from "../components/landing-navbar"
import { LandingHero } from "../components/landing-hero"
import { LandingFeatures } from "../components/landing-features"
import { LandingTestimonials } from "../components/landing-testimonials"
import { LandingPricing } from "../components/landing-pricing"
import { LandingCta } from "../components/landing-cta"
import { LandingFooter } from "../components/landing-footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingTestimonials />
        <LandingPricing />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  )
}
