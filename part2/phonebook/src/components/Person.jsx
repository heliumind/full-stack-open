const Person = ({ person, deleteHandler }) => (
  <li>
    {person.name} {person.number}
    <button onClick={deleteHandler}>delete</button>
  </li>
)

export default Person
