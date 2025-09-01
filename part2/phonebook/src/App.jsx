import { useState, useEffect } from 'react'
import personService from './services/persons'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

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

    personService.create(newPerson).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setInfoMessage(`Added ${returnedPerson.name}`)
      setTimeout(() => setInfoMessage(null), 5000)
    })
  }

  const deleteHandler = (id) => () => {
    const person = persons.find((p) => p.id === id)
    if (confirm(`Delete ${person.name}?`)) {
      personService.deleteId(id).then((deletedPerson) => {
        setPersons(persons.filter((p) => p.id !== deletedPerson.id))
      })
    }
  }

  const handleChange = (setFunc) => (event) => setFunc(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={infoMessage} />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleChange(setNewName)}
        onNumberChange={handleChange(setNewNumber)}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>
      <Persons persons={persons} deleteHandler={deleteHandler} />
    </div>
  )
}

export default App
