import { useState } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' },
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber,
    }

    setPersons(persons.concat(newPerson))
    setNewName('')
  }

  const handleChange = (setFunc) => (event) => setFunc(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleChange(setNewName)}
        onNumberChange={handleChange(setNewNumber)}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>
      <Persons persons={persons} />
    </div>
  )
}

export default App
