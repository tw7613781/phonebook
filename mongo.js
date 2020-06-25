const mongoose = require('mongoose')

if (!(process.argv.length === 3 || process.argv.length === 5)) {
  console.log(`
        cli format is incorrect, please follow blew:
          add person ===> node mongo.js <password> <name> <number>
        show persons ===> node mongo.js <passwrod>
    `)
  process.exit(1)
}

async function main() {
  const password = process.argv[2]
  const name = process.argv[3]
  const number = process.argv[4]

  const url = `mongodb+srv://fullstack:${password}@cluster0-0gg7u.gcp.mongodb.net/person-app?retryWrites=true&w=majority`

  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('connected successful')
  } catch (e) {
    throw e
  }

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personSchema, 'persons')

  if (!(name && number)) {
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
      number,
    })

    person.save().then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
  }
}

main().catch((e) => {
  console.log(e)
})
