import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { EDIT_AUTHOR } from '../queries'
import Select from 'react-select'

const EditAuthor = ({ options }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [changeAuthor] = useMutation(EDIT_AUTHOR)

  const submit = (event) => {
    event.preventDefault()
    changeAuthor({ variables: { name, born } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h3> Set birthyear</h3>

      <form onSubmit={submit}>
        <Select
          defaultValue={name}
          onChange={(target) => {
            setName(target.value)
          }}
          options={options}
        />
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default EditAuthor
