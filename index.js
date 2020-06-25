require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

morgan.token('body', (req) => {
  if (req.body.name) return JSON.stringify(req.body)
  else return '-'
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const PORT = process.env.PORT

app.get('/info', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      const num = persons.length
      const date = new Date()
      const output = `Phonebook has info for ${num} people`
      res.send(
        `
            <p>${output}</p>
            <p>${date.toString()}</p>
            `
      )
    })
    .catch((e) => {
      next(e)
    })
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((e) => {
      next(e)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((e) => {
      next(e)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((ret) => {
      if (ret) {
        res.status(204).end()
      } else {
        res.status(404).end()
      }
    })
    .catch((e) => {
      next(e)
    })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((e) => {
      next(e)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).end()
      }
    })
    .catch((e) => {
      next(e)
    })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.name === 'CastError') {
    res.status(400).send({ error: 'malformatted id' })
  }
  if (err.name === 'SyntaxError') {
    res.status(400).send({ error: err.message })
  }
  if (err.name === 'ValidationError') {
    res.status(400).send({ error: err.message })
  }
  next(err)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
