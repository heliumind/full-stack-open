import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logoutUser } from './reducers/authReducer'
import Notification from './components/Notifications'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector((state) => state.authUser)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <div>
      {!user && <LoginForm />}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notification />
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <BlogForm />
          <BlogList user={user} />
        </div>
      )}
    </div>
  )
}

export default App
