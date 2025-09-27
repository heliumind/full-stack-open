import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'
import Toggleable from './Toggleable'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog({ title, author, url }))
      dispatch(
        setNotification(`a new blog ${title} by ${author} added`, 'info', 5)
      )
    } catch {
      dispatch(setNotification('blog creation failed', 'error', 5))
    } finally {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title:
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </Toggleable>
  )
}

export default BlogForm
