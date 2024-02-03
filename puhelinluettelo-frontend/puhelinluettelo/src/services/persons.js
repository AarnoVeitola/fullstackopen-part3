import axios from "axios"
const baseUrl = "http://localhost:3001/persons"

const createPerson = newObject => {
    const request = axios.post(baseUrl, newObject)
    console.log("POST request sent to JSON server")
    return request.then(response => response.data)
}

const getPersons = () => {
    const request = axios.get(baseUrl)
    console.log("GET request sent to JSON server")
    return request.then(response => response.data)
}

const deletePerson = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    console.log("DELETE request sent to JSON server")
    return request.then(response => response.data)
}

const updatePerson = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    console.log("PUT request sent to JSON server")
    return request.then(response => response.data)
}

export default { createPerson, getPersons, deletePerson, updatePerson }