const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.9n72tpo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const savePerson = (person) => {
  person.save().then(() => {
    console.log(`added ${person.name} numer ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}

const getAll = () => {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

switch (process.argv.length) {
  case 3: {
    getAll()
    break
  }
  case 5: {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })
    savePerson(person)
    break
  }
  default: {
    console.log('incorrect usage')
  }
}
