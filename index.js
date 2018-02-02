const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('data', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

// let persons = [
//     {
//         "name": "Arto Hellas",
//         "number": "040-123456",
//         "id": 1
//     },
//     {
//         "name": "Martti Tienari",
//         "number": "040-123456",
//         "id": 2
//     },
//     {
//         "name": "Arto Järvinen",
//         "number": "040-123456",
//         "id": 3
//     },
//     {
//         "name": "Lea Kutvonen",
//         "number": "040-123456",
//         "id": 4
//     },
// ]


const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

app.get('/api/persons', (request, response) => {

    Person
        .find({}, { __v: 0 })
        .then(persons => {
            response.json(persons.map(Person.format))
        })
})

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.send(`<p> Puhelinluettelossa on ${persons.length} henkilön tiedot </p><p>${new Date()}</p>`)
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'name/number missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => {
            response.json(Person.format(savedPerson))
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person
      .findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(Person.format(person))
        } else {
          response.status(404).end()
        }
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
      })
  })

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: 'Malformatted id' })
        })
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'Malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



