import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: '',
  reducers: {
    createNotification(state, action) {
      return action.payload
    },
    deleteNotification(state, action) {
      return ''
    },
  },
})

export const setNotification = (text, timeout) => {
  return (dispatch) => {
    dispatch(createNotification(text))
    setTimeout(() => {
      dispatch(deleteNotification())
    }, timeout * 1000)
  }
}

export const { createNotification, deleteNotification } =
  notificationSlice.actions

export default notificationSlice.reducer
