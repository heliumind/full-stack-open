import Person from './Person'

const Persons = ({ persons, deleteHandler }) =>
  persons.map((person) => (
    <Person
      key={person.name}
      person={person}
      deleteHandler={deleteHandler(person.id)}
    />
  ))

export default Persons
