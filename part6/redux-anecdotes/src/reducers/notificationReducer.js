import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    deleteNotification(state, action) {
      return ''
    },
  },
})

export const createNotification = (text, timeout) => {
  return (dispatch) => {
    dispatch(setNotification(text))
    setTimeout(() => {
      dispatch(deleteNotification())
    }, timeout * 1000)
  }
}

export const { setNotification, deleteNotification } = notificationSlice.actions

export default notificationSlice.reducer
