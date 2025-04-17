import models from "../models/index.js"
import { BadRequestError, NotFoundError, ForbiddenError } from "../middleware/errorHandler.js"
import { slugify } from "../utils/helpers.js"
import { Op } from "sequelize"

/**
 * Get all blog posts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAllPosts = async (req, res, next) => {
  try {
    const { status, tag, search, limit = 10, offset = 0 } = req.query

    // Build query
    const query = {
      where: {},
      order: [["createdAt", "DESC"]],
      limit: Number.parseInt(limit, 10),
      offset: Number.parseInt(offset, 10),
      include: [
        {
          model: models.User,
          as: "author",
          attributes: ["id", "firstName", "lastName", "picture"],
        },
      ],
    }

    // If user is not admin, only show published posts
    if (!req.user || req.user.role !== "admin") {
      query.where.status = "published"
    } else if (status) {
      query.where.status = status
    }

    // Filter by tag
    if (tag) {
      query.where.tags = { [Op.contains]: [tag] }
    }

    // Search in title and content
    if (search) {
      query.where[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }, { content: { [Op.iLike]: `%${search}%` } }]
    }

    // Get posts
    const posts = await models.BlogPost.findAll(query)

    // Get total count
    const totalCount = await models.BlogPost.count({
      where: query.where,
    })

    res.json({
      posts,
      totalCount,
      limit: Number.parseInt(limit, 10),
      offset: Number.parseInt(offset, 10),
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get blog post by slug
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params

    // Find post
    const post = await models.BlogPost.findOne({
      where: { slug },
      include: [
        {
          model: models.User,
          as: "author",
          attributes: ["id", "firstName", "lastName", "picture"],
        },
      ],
    })

    if (!post) {
      throw new NotFoundError("Blog post not found")
    }

    // If post is not published and user is not admin or author, return 404
    if (post.status !== "published" && (!req.user || (req.user.role !== "admin" && req.user.id !== post.userId))) {
      throw new NotFoundError("Blog post not found")
    }

    res.json(post)
  } catch (error) {
    next(error)
  }
}

/**
 * Create blog post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, featuredImage, status, tags } = req.body

    if (!title || !content) {
      throw new BadRequestError("Title and content are required")
    }

    // Generate slug
    let slug = slugify(title)

    // Check if slug already exists
    const existingPost = await models.BlogPost.findOne({ where: { slug } })
    if (existingPost) {
      // Append a random string to make the slug unique
      slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`
    }

    // Create post
    const post = await models.BlogPost.create({
      userId: req.user.id,
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 150) + "...",
      featuredImage,
      status: status || "draft",
      tags: tags || [],
      publishedAt: status === "published" ? new Date() : null,
    })

    res.status(201).json(post)
  } catch (error) {
    next(error)
  }
}

/**
 * Update blog post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, content, excerpt, featuredImage, status, tags } = req.body

    // Find post
    const post = await models.BlogPost.findByPk(id)

    if (!post) {
      throw new NotFoundError("Blog post not found")
    }

    // Check if user is authorized to update this post
    if (req.user.role !== "admin" && req.user.id !== post.userId) {
      throw new ForbiddenError("You are not authorized to update this post")
    }

    // Update slug if title changed
    let slug = post.slug
    if (title && title !== post.title) {
      slug = slugify(title)

      // Check if slug already exists
      const existingPost = await models.BlogPost.findOne({
        where: {
          slug,
          id: { [Op.ne]: id },
        },
      })

      if (existingPost) {
        // Append a random string to make the slug unique
        slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`
      }
    }

    // Check if status changed to published
    const publishedAt = status === "published" && post.status !== "published" ? new Date() : post.publishedAt

    // Update post
    await post.update({
      title: title || post.title,
      slug,
      content: content || post.content,
      excerpt: excerpt || (content ? content.substring(0, 150) + "..." : post.excerpt),
      featuredImage: featuredImage !== undefined ? featuredImage : post.featuredImage,
      status: status || post.status,
      tags: tags || post.tags,
      publishedAt,
    })

    res.json(post)
  } catch (error) {
    next(error)
  }
}

/**
 * Delete blog post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params

    // Find post
    const post = await models.BlogPost.findByPk(id)

    if (!post) {
      throw new NotFoundError("Blog post not found")
    }

    // Check if user is authorized to delete this post
    if (req.user.role !== "admin" && req.user.id !== post.userId) {
      throw new ForbiddenError("You are not authorized to delete this post")
    }

    // Delete post
    await post.destroy()

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

/**
 * Get all tags
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAllTags = async (req, res, next) => {
  try {
    // Get all tags from all posts
    const result = await models.sequelize.query(`
      SELECT DISTINCT unnest(tags) as tag, count(*) as count
      FROM blog_posts
      WHERE status = 'published'
      GROUP BY tag
      ORDER BY count DESC
    `)

    res.json(result[0])
  } catch (error) {
    next(error)
  }
}
