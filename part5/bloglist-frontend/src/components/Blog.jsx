import { useState } from 'react'

const Blog = ({ blog, addLikes, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = async () => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    await addLikes(blog.id, blogObject)
  }

  const handleDelete = async () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await deleteBlog(blog.id)
    }
  }

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)

  return (
    <div>
      {!visible && (
        <div style={blogStyle}>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>view</button>
        </div>
      )}
      {visible && (
        <div style={blogStyle}>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>hide</button>
          <p>{blog.url}</p>
          <p>
            {blog.likes}
            <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.user !== null && blog.user.name}</p>
          {blog.user.username === user.username && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
