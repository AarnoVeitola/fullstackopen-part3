const Filter = ({ filter, handleChange }) => {
    return (
      <form>
        <div>
          filter shown with <input value={filter} onChange={handleChange} />
        </div>
      </form>
    )
}

export default Filter