import { createSlice } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload)
    },
    updateBlog(state, action) {
      const newBlogs = state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog
      )
      return newBlogs.sort((a, b) => b.likes - a.likes)
    },
  },
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogsService.getAll()
    blogs.sort((a, b) => b.likes - a.likes)
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (newObject) => {
  return async (dispatch) => {
    const newBlog = await blogsService.create(newObject)
    dispatch(appendBlog(newBlog))
  }
}

export const deleteBlog = (blogId) => {
  return async (dispatch) => {
    await blogsService.deleteBlog(blogId)
    dispatch(removeBlog(blogId))
  }
}

export const addLikes = (blogObject) => {
  return async (dispatch) => {
    const updatedBlog = await blogsService.update(blogObject.id, {
      title: blogObject.title,
      author: blogObject.author,
      url: blogObject.url,
      likes: blogObject.likes + 1,
    })
    dispatch(updateBlog(updatedBlog))
  }
}

export const createComment = (blogId, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogsService.comment(blogId, comment)
    dispatch(updateBlog(updatedBlog))
  }
}

export const { appendBlog, setBlogs, removeBlog, updateBlog } =
  blogSlice.actions

export default blogSlice.reducer
