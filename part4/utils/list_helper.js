const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return null
  }

  const reducer = (max, blog) => {
    return blog.likes > max.likes ? blog : max
  }
  return blogs.reduce(reducer)
}

module.exports = { dummy, totalLikes, favoriteBlog }
