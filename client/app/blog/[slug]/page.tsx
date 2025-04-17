"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { CalendarIcon, Clock, ArrowLeft, Share2, Bookmark } from "lucide-react"
// import DashboardLayout from "../../../components/layouts/dashboard-layout"
import DashboardLayout from "../../dashboard/layout"

// Mock blog post data
const post = {
  id: "1",
  title: "Understanding Cloud Cost Optimization: A Comprehensive Guide",
  slug: "understanding-cloud-cost-optimization",
  content: `
  <p>Cloud cost optimization is a critical aspect of managing your cloud infrastructure efficiently. As organizations increasingly migrate to the cloud, managing and optimizing cloud costs has become a top priority for IT leaders and finance teams alike.</p>
  
  <h2>Why Cloud Cost Optimization Matters</h2>
  
  <p>According to recent studies, organizations waste approximately 30% of their cloud spend due to inefficient resource allocation, overprovisioning, and lack of visibility into their cloud environments. This represents a significant opportunity for cost savings without compromising performance or reliability.</p>
  
  <p>Cloud cost optimization is not just about reducing costs—it's about maximizing the value you get from your cloud investments. By optimizing your cloud costs, you can:</p>
  
  <ul>
    <li>Improve your organization's bottom line</li>
    <li>Free up budget for innovation and growth initiatives</li>
    <li>Enhance cloud governance and compliance</li>
    <li>Increase operational efficiency</li>
  </ul>
  
  <h2>Key Strategies for Cloud Cost Optimization</h2>
  
  <h3>1. Right-sizing Resources</h3>
  
  <p>Right-sizing involves matching instance types and sizes to your workload performance and capacity requirements. Many organizations over-provision their resources to ensure they have enough capacity, but this leads to unnecessary costs.</p>
  
  <p>By analyzing performance metrics and usage patterns, you can identify opportunities to downsize or upgrade resources to achieve the optimal balance between cost and performance.</p>
  
  <h3>2. Implementing Auto-scaling</h3>
  
  <p>Auto-scaling allows you to automatically adjust the number of compute resources based on demand. This ensures that you have enough resources during peak times and can scale down during periods of low demand, optimizing costs without sacrificing performance.</p>
  
  <h3>3. Utilizing Reserved Instances and Savings Plans</h3>
  
  <p>Cloud providers offer significant discounts for committing to use a certain amount of resources over a period of time. By analyzing your usage patterns and identifying stable, predictable workloads, you can leverage these pricing models to reduce your costs by up to 75% compared to on-demand pricing.</p>
  
  <h3>4. Implementing Resource Scheduling</h3>
  
  <p>Not all workloads need to run 24/7. By implementing scheduling policies to automatically start and stop non-production resources during off-hours, you can reduce costs by 65% or more for these environments.</p>
  
  <h3>5. Monitoring and Eliminating Waste</h3>
  
  <p>Regularly monitoring your cloud environment to identify and eliminate waste is crucial for cost optimization. Common sources of waste include:</p>
  
  <ul>
    <li>Idle resources</li>
    <li>Orphaned volumes and snapshots</li>
    <li>Outdated snapshots</li>
    <li>Unused load balancers</li>
    <li>Over-provisioned databases</li>
  </ul>
  
  <h2>Tools for Cloud Cost Optimization</h2>
  
  <p>Several tools can help you optimize your cloud costs:</p>
  
  <ul>
    <li><strong>CloudWise:</strong> Our AI-powered platform provides comprehensive cost visibility, automated recommendations, and optimization across AWS, Azure, and GCP.</li>
    <li><strong>Native Cloud Provider Tools:</strong> AWS Cost Explorer, Azure Cost Management, and Google Cloud Cost Management provide basic cost visibility and some optimization recommendations.</li>
    <li><strong>Open Source Tools:</strong> Tools like Komiser and Infracost can help with specific aspects of cost optimization.</li>
  </ul>
  
  <h2>Best Practices for Implementing Cloud Cost Optimization</h2>
  
  <ol>
    <li><strong>Establish a Cost Optimization Culture:</strong> Make cost optimization a shared responsibility across teams.</li>
    <li><strong>Implement Tagging and Cost Allocation:</strong> Use tags to attribute costs to specific teams, projects, or environments.</li>
    <li><strong>Set Up Budgets and Alerts:</strong> Proactively monitor spending and get notified when costs exceed thresholds.</li>
    <li><strong>Regularly Review and Optimize:</strong> Cloud cost optimization is an ongoing process, not a one-time effort.</li>
    <li><strong>Leverage Automation:</strong> Use automation to implement and enforce cost optimization policies.</li>
  </ol>
  
  <h2>Conclusion</h2>
  
  <p>Cloud cost optimization is a continuous journey that requires a combination of the right tools, processes, and organizational culture. By implementing the strategies outlined in this guide, you can significantly reduce your cloud costs while maintaining or even improving performance and reliability.</p>
  
  <p>At CloudWise, we're committed to helping organizations optimize their cloud costs through our AI-powered platform. Contact us to learn how we can help you achieve significant savings across your cloud environments.</p>
`,
  featuredImage: "/images/blog/cloud-cost-optimization.jpg",
  publishedAt: "2025-03-15T10:00:00Z",
  author: {
    name: "Sarah Johnson",
    avatar: "/images/avatars/sarah.jpg",
    bio: "Sarah is a cloud optimization expert with over 10 years of experience in cloud architecture and cost management.",
  },
  tags: ["Cost Optimization", "AWS", "Azure", "GCP"],
  readTime: "8 min read",
}

export default function BlogPostPage() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch the blog post data
    // const fetchPost = async () => {
    //   try {
    //     const response = await fetch(`/api/blog/posts/${params.slug}`)
    //     const data = await response.json()
    //     setPost(data)
    //   } catch (error) {
    //     console.error("Error fetching blog post:", error)
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }

    // fetchPost()

    // For demo purposes, just simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [params.slug])

  if (isLoading) {
    return <div className="container py-10 flex justify-center">Loading...</div>
  }

  return (
    <DashboardLayout>
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/blog" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar || "/placeholder.svg?height=32&width=32"}
                  alt={post.author.name}
                  className="h-6 w-6 rounded-full"
                />
                <span>{post.author.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
            <img
              src={post.featuredImage || "/placeholder.svg?height=400&width=800"}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>

          <div
            className="prose prose-lg max-w-none dark:prose-invert mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="border-t pt-6 mt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={post.author.avatar || "/placeholder.svg?height=64&width=64"}
                  alt={post.author.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{post.author.name}</h3>
                  <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
                <Button variant="outline" size="icon">
                  <Bookmark className="h-4 w-4" />
                  <span className="sr-only">Bookmark</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
