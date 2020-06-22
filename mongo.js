const mongoose = require('mongoose')

console.log(process.argv.length)

if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log('cli format is incorrect, please follow anyone of blew')
    console.log('insert => node mongo.js <password> <name> <number>')
    console.log('select all => node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://fullstack:${password}@cluster0-0gg7u.gcp.mongodb.net/person-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (!name && !number) {
    Person.find({}).then((result) => {
        console.log('phonebook')
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name,
        number
        })
      
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}



