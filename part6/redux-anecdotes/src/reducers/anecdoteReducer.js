import { createSlice } from '@reduxjs/toolkit'
import anecdotesService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createVote(state, action) {
      const id = action.payload
      return state.map((a) => (a.id !== id ? a : { ...a, votes: a.votes + 1 }))
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdotesService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const addVote = (anecdote) => {
  return async (dispatch) => {
    const changedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    console.log(changedAnecdote)
    await anecdotesService.update(anecdote.id, changedAnecdote)
    dispatch(createVote(anecdote.id))
  }
}

export const { createVote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions
export default anecdoteSlice.reducer
