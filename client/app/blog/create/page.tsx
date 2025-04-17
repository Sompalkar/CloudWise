"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { useToast } from "../../../hooks/use-toast"
import { ArrowLeft, Save, ImageIcon } from "lucide-react"
import { RichTextEditor } from "../../../components/blog/rich-text-editor"

export default function CreateBlogPostPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
    featuredImage: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraft, setIsDraft] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsDraft(saveAsDraft)

    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/blog/posts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     status: saveAsDraft ? 'draft' : 'published',
      //     tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      //   }),
      // })
      // const data = await response.json()

      toast({
        title: saveAsDraft ? "Draft saved" : "Blog post published",
        description: saveAsDraft
          ? "Your draft has been saved successfully."
          : "Your blog post has been published successfully.",
      })

      router.push("/blog")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create blog post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/blog" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create New Blog Post</CardTitle>
            <CardDescription>Write and publish a new blog post</CardDescription>
          </CardHeader>
          <form onSubmit={(e) => handleSubmit(e, false)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter blog post title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief summary of the post"
                />
                <p className="text-xs text-muted-foreground">
                  A short summary that appears in blog listings. If left empty, we'll use the first few sentences of
                  your content.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="featuredImage"
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button type="button" variant="outline" className="flex-shrink-0">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="AWS, Cost Optimization, Cloud Management"
                />
                <p className="text-xs text-muted-foreground">Separate tags with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your blog post content here..."
                  minHeight="400px"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/blog")}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting}>
                  {isSubmitting && isDraft ? "Saving..." : "Save as Draft"}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && !isDraft ? "Publishing..." : "Publish"}
                  <Save className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
