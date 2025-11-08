const Recommend = ({ user, books }) => {
  const favoriteGenre = user ? user.favoriteGenre : null
  const filteredBooks = books.filter((b) => b.genres.includes(favoriteGenre))

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
