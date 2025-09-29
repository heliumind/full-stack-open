import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../reducers/authReducer'

const Menu = () => {
  const authUser = useSelector((state) => state.authUser)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const padding = {
    backgroundColor: 'lightGrey',
    padding: 5,
  }

  return (
    <div style={padding}>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      {authUser.name} logged in
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Menu
