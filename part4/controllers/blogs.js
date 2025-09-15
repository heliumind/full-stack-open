const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  await blog.populate('user', { username: 1, name: 1 })
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  let body = req.body
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const { userId, ...rest } = body
  body = { ...rest }
  const blog = new Blog({
    ...body,
    likes: body.likes || 0,
    user: user.id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).end()
  }

  if (blog.user.toString() !== user.id) {
    return res.status(401).json({ error: 'Unauthorized to delete the blog' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).end()
  }

  Object.assign(blog, req.body)
  const updatedBlog = await blog.save()
  await updatedBlog.populate('user', { username: 1, name: 1 })
  res.json(updatedBlog)
})

module.exports = blogsRouter
