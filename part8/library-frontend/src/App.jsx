import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, USER } from './queries'
import { updateCache } from './utils'

const App = () => {
  const padding = {
    padding: 5,
  }

  useEffect(() => {
    const userToken = localStorage.getItem('library-user-token')
    if (userToken) {
      setToken(userToken)
    }
  }, [])

  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const user = useQuery(USER)
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log(data)
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })

  if (authors.loading || books.loading || user.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <Router>
        <div>
          <Link style={padding} to="/">
            authors
          </Link>
          <Link style={padding} to="/books">
            books
          </Link>
          {token && (
            <Link style={padding} to="/add">
              add book
            </Link>
          )}
          {token && (
            <Link style={padding} to="/recommend">
              recommend
            </Link>
          )}
          {!token && (
            <Link style={padding} to="/login">
              login
            </Link>
          )}
          {token && <button onClick={logout}>logout</button>}
        </div>
        <Routes>
          <Route
            path="/login"
            element={<LoginForm setError={notify} setToken={setToken} />}
          />
          <Route
            path="/recommend"
            element={<Recommend user={user.data.me} />}
          />
          <Route
            path="/books"
            element={<Books books={books.data.allBooks} />}
          />
          <Route path="/add" element={<NewBook setError={notify} />} />
          <Route
            path="/"
            element={
              <Authors authors={authors.data.allAuthors} setError={notify} />
            }
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
