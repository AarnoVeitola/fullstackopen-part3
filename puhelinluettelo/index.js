const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    console.log(body)

    if (!body.name) {
        return response.status(400).json({
            error: 'name not specified'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number not specified'
        })
    }

    // if (persons.map(p => p.name).includes(body.name)) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => {
        console.log(error)
        response.status(500).end()
    })
})

app.get('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // const person = persons.find(person => person.id === id)
    // console.log(person)
    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }

    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    console.log(person)
    if (person) {
        persons = persons.filter(person => person.id != id)
        console.log(person, "deleted")
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const getCurrentTime = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const now = new Date()
        
        const year = now.getFullYear()
        const month = months[now.getMonth()]
        const dayOfWeek = days[now.getDay()]
        const dayOfMonth = now.getDate()
        const hours = ('0' + now.getHours()).slice(-2)
        const minutes = ('0' + now.getMinutes()).slice(-2)
        const seconds = ('0' + now.getSeconds()).slice(-2)
        const timeZoneOffset = now.getTimezoneOffset() / -60
        const timeZone = (timeZoneOffset >= 0 ? '+' : '-') + ('0' + Math.abs(timeZoneOffset)).slice(-2) + '00'
        const timeZoneName = 'Eastern European Standard Time'
      
        return `${dayOfWeek} ${month} ${dayOfMonth} ${year} ${hours}:${minutes}:${seconds} GMT${timeZone} (${timeZoneName})`
    }
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${getCurrentTime()}</p>
    `)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})