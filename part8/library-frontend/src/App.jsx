import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql, useQuery } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

const App = () => {
  const padding = {
    padding: 5,
  }

  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)

  if (authors.loading || books.loading) {
    return <div>loading...</div>
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">
          authors
        </Link>
        <Link style={padding} to="/books">
          books
        </Link>
        <Link style={padding} to="/add">
          add book
        </Link>
      </div>

      <Routes>
        <Route path="/books" element={<Books books={books.data.allBooks} />} />
        <Route path="/add" element={<NewBook />} />
        <Route
          path="/"
          element={<Authors authors={authors.data.allAuthors} />}
        />
      </Routes>
    </Router>
  )
}

export default App
