const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log(`connecting to mongodb ${url}`)
try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('connected successful')
} catch (e) {
    throw(e)
}

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema, 'persons')