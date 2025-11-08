import EditAuthor from './EditAuthor'

const Authors = ({ authors, setError }) => {
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditAuthor
        options={authors.map((a) => ({ value: a.name, label: a.name }))}
        setError={setError}
      />
    </div>
  )
}

export default Authors
