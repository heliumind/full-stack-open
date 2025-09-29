import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: null,
  reducers: {
    createNotification(state, action) {
      return action.payload
    },
    deleteNotification(state, action) {
      return null
    },
  },
})

export const setNotification = (message, type, timeout) => {
  return (dispatch) => {
    dispatch(createNotification({ message, type }))
    setTimeout(() => {
      dispatch(deleteNotification())
    }, timeout * 1000)
  }
}

export const { createNotification, deleteNotification } =
  notificationSlice.actions

export default notificationSlice.reducer
