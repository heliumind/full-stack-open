const Blog = require('../models/blog')

const initialBlogs = require('./fixtures/blog_list.json')

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'someurl' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
}
