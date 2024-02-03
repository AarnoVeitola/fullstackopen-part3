const Persons = ({ persons, filter, handleSubmit }) => {
    const numbers = persons.filter(person => 
      person.name.toLowerCase().startsWith(filter.toLowerCase())
    )
  
    return (
      <ul>
        {numbers.map(person =>
          <div key={person.name}>
            <Number person={person} /> 
            <Delete handleSubmit={handleSubmit} person={person}/> 
          </div>
        )}
      </ul>
    )
}
  
const Number = ({ person }) => {
  return (
    <li>
      {person.name} {person.number}
    </li>
  )
}

const Delete = ({ handleSubmit, person }) => {
  return (
    <form onSubmit={(event) => handleSubmit(event, person.id)}>
      <div>
        <button type="submit">delete</button>
      </div>
    </form>
  )
}

export default Persons