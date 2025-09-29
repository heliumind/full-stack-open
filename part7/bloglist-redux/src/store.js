import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import notificationReducer from './reducers/notificationReducer'
import authReducer from './reducers/authReducer'

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    users: userReducer,
    notifications: notificationReducer,
    authUser: authReducer,
  },
})

export default store
