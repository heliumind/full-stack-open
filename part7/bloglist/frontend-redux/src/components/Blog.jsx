import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { deleteBlog, addLikes, createComment } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = () => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.authUser)

  const id = useParams().id
  const blogs = useSelector((state) => state.blogs)
  const blog = blogs.find((blog) => blog.id === id)

  if (!blog) {
    return null
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

  const addComment = (event) => {
    event.preventDefault()
    dispatch(createComment(blog.id, comment))
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <p>
        <span>{blog.likes} likes</span>
        <button onClick={handleLike}>like</button>
      </p>
      <p>added by {blog.user !== null && blog.user.name}</p>
      {blog.user.username === authUser.username && (
        <button onClick={handleDelete}>remove</button>
      )}
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <input
          type="text"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment) => (
          <li>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default Blog
