import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = ({ books }) => {
  const [filter, setFilter] = useState('')
  const bookFilter = useQuery(ALL_BOOKS, { variables: { genre: filter } })

  if (bookFilter.loading) {
    return <div>loading...</div>
  }

  const genres = [...new Set(books.map((b) => b.genres).flat())]
  const filteredBooks = filter === '' ? books : bookFilter.data.allBooks

  return (
    <div>
      <h2>books</h2>
      in genre <b>{filter}</b>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((g) => (
        <button key={g} onClick={() => setFilter(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setFilter('')}>all genres</button>
    </div>
  )
}

export default Books
