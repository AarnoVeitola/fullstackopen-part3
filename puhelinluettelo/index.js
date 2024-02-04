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


app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(result => {
        response.json(result)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

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

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.json(result).status(204)
      })
      .catch(error => next(error))
  })

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
        response.json(updatedPerson)
        })
        .catch(error => next(error))
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
    Person.find({}).then(result => {
        response.send(`
        <p>Phonebook has info for ${result.length} people</p>
        <p>${getCurrentTime()}</p>
        `)
    })
    .catch(error => next(error))
    
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})