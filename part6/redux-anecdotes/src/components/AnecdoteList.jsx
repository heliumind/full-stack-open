import { useSelector, useDispatch } from 'react-redux'
import { createVote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector((state) =>
    state.sort((a, b) => b.likes - a.likes)
  )
  const dispatch = useDispatch()

  const addVote = (id) => {
    dispatch(createVote(id))
  }
  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => addVote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
