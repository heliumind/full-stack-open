import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notifications'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNotification({ type: 'error', message: 'wrong username or password' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setNotification({
        type: 'info',
        message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      })
    } catch {
      setNotification({ type: 'error', message: 'blog creation failed' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const addLikes = async (blogId, blogObject) => {
    const updatedBlog = await blogService.update(blogId, blogObject)
    setBlogs(blogs.map((blog) => (blog.id === blogId ? updatedBlog : blog)))
  }

  const deleteBlog = async (blogId) => {
    await blogService.deleteBlog(blogId)
    setBlogs(blogs.filter((blog) => blog.id != blogId))
  }

  const loginForm = () => (
    <div>
      <h2>log in to application </h2>
      <Notification notification={notification} />
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notification notification={notification} />
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Toggleable>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              addLikes={addLikes}
              deleteBlog={deleteBlog}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
