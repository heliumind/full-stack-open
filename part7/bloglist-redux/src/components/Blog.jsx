import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteBlog, addLikes } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = () => {
    dispatch(addLikes(blog))
    dispatch(setNotification(`Liked blog ${blog.title}`, 'info', 5))
  }

  const handleDelete = () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog.id))
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
        <div style={blogStyle} data-testid="blog card">
          <span>
            {blog.title} {blog.author}
          </span>
          <button onClick={toggleVisibility}>hide</button>
          <p>{blog.url}</p>
          <p>
            <span>{blog.likes}</span>
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
