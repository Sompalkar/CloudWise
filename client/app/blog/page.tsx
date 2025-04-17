import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { CalendarIcon, Clock } from "lucide-react"
// import DashboardLayout from "../../components/layouts/dashboard-layout"
import DashboardLayout from "../dashboard/layout"


// Mock blog posts data
const posts = [
  {
    id: "1",
    title: "Understanding Cloud Cost Optimization: A Comprehensive Guide",
    slug: "understanding-cloud-cost-optimization",
    excerpt:
      "Learn how to effectively optimize your cloud costs across AWS, Azure, and GCP with practical strategies and tools.",
    featuredImage: "/images/blog/cloud-cost-optimization.jpg",
    publishedAt: "2025-03-15T10:00:00Z",
    author: {
      name: "Sarah Johnson",
      avatar: "/images/avatars/sarah.jpg",
    },
    tags: ["Cost Optimization", "AWS", "Azure", "GCP"],
    readTime: "8 min read",
  },
  {
    id: "2",
    title: "Top 10 Ways to Reduce Your AWS Bill",
    slug: "top-10-ways-reduce-aws-bill",
    excerpt:
      "Discover practical tips and strategies to significantly reduce your AWS costs without compromising performance or reliability.",
    featuredImage: "/images/blog/aws-cost-reduction.jpg",
    publishedAt: "2025-03-10T14:30:00Z",
    author: {
      name: "Michael Chen",
      avatar: "/images/avatars/michael.jpg",
    },
    tags: ["AWS", "Cost Reduction", "Best Practices"],
    readTime: "6 min read",
  },
  {
    id: "3",
    title: "Multi-Cloud Strategy: Benefits and Challenges",
    slug: "multi-cloud-strategy-benefits-challenges",
    excerpt:
      "Explore the advantages and potential pitfalls of implementing a multi-cloud strategy for your organization.",
    featuredImage: "/images/blog/multi-cloud.jpg",
    publishedAt: "2025-03-05T09:15:00Z",
    author: {
      name: "Priya Patel",
      avatar: "/images/avatars/priya.jpg",
    },
    tags: ["Multi-Cloud", "Strategy", "Cloud Management"],
    readTime: "10 min read",
  },
  {
    id: "4",
    title: "Automating Cloud Cost Management with CloudWise",
    slug: "automating-cloud-cost-management-cloudwise",
    excerpt:
      "Learn how CloudWise's AI-powered platform can help you automate cost management across your cloud infrastructure.",
    featuredImage: "/images/blog/automation.jpg",
    publishedAt: "2025-02-28T11:45:00Z",
    author: {
      name: "Alex Rodriguez",
      avatar: "/images/avatars/alex.jpg",
    },
    tags: ["Automation", "CloudWise", "Cost Management"],
    readTime: "7 min read",
  },
]

export default function BlogPage() {
  return (
    <DashboardLayout>
      <div className="container py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4">CloudWise Blog</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Insights, tips, and best practices for optimizing your cloud costs and improving efficiency
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col h-full">
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={post.featuredImage || "/placeholder.svg?height=200&width=400"}
                  alt={post.title}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <CalendarIcon className="h-4 w-4" />
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span className="mx-1">•</span>
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
                <CardTitle className="line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <CardDescription className="line-clamp-3 mb-4">{post.excerpt}</CardDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatar || "/placeholder.svg?height=32&width=32"}
                    alt={post.author.name}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-sm">{post.author.name}</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/blog/${post.slug}`}>Read more</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
