require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

morgan.token('body', (req) => {
    if (req.body.name)  return JSON.stringify(req.body) 
    else return '-'
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const PORT = process.env.PORT

const randomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max) )
}

app.get('/info', (req, res) => {
    const personNum = persons.length
    const date = new Date()
    const output = `Phonebook has info for ${personNum} people`
    res.send(
        `
        <p>${output}</p>
        <p>${date.toString()}</p>
        `
    )
})

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then( (persons) => {
        res.json(persons)
    }).catch( (e) => {
        next(e)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then((person) => {
        res.json(person)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter((person) => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then((savedPerson) => {
        res.json(savedPerson)
    })
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})