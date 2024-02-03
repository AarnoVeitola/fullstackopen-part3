const PersonForm = ({ handleSubmit, value1, value2, handleChange1, handleChange2 }) => {
    return (
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={value1} onChange={handleChange1} />
          <br/>
          number: <input value={value2} onChange={handleChange2} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm