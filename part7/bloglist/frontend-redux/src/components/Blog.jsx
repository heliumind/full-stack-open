import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Form, Button, ListGroup } from 'react-bootstrap'
import { deleteBlog, addLikes, createComment } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = () => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.authUser)

  const id = useParams().id
  const blogs = useSelector((state) => state.blogs)
  const blog = blogs.find((blog) => blog.id === id)

  const navigate = useNavigate()

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
    navigate('/')
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
        <Button variant="success" size="sm" onClick={handleLike}>
          like
        </Button>
      </p>
      <p>added by {blog.user !== null && blog.user.name}</p>
      {blog.user.username === authUser.username && (
        <Button variant="danger" onClick={handleDelete}>
          remove
        </Button>
      )}
      <h3>comments</h3>
      <Form onSubmit={addComment}>
        <Form.Control
          type="text"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <Button variant="primary" type="submit">
          add comment
        </Button>
      </Form>
      <ListGroup>
        {blog.comments.map((comment) => (
          <ListGroup.Item>{comment}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default Blog
