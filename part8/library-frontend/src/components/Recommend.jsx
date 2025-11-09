import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Recommend = ({ user }) => {
  const favoriteGenre = user?.favoriteGenre ?? null
  const bookFilter = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
  })

  if (bookFilter.loading) {
    return <div>loading...</div>
  }

  const filteredBooks = bookFilter.data.allBooks

  return (
    <div>
      <h2>Recommendations</h2>
      books in your favorite genres <b>{favoriteGenre}</b>
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
    </div>
  )
}

export default Recommend
