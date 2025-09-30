import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/userReducer'
import { initializeUser } from './reducers/authReducer'
import Menu from './components/Menu'
import Notification from './components/Notifications'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import UserList from './components/UserList'
import User from './components/User'

const Home = () => (
  <div>
    <BlogForm />
    <BlogList />
  </div>
)

const App = () => {
  const authUser = useSelector((state) => state.authUser)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUser())
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [])

  return (
    <div className="container">
      {authUser && <Menu />}
      <Notification />
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <LoginForm />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </div>
  )
}

export default App
