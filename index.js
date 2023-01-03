require ('dotenv').config
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {

  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {

  Person.collection.countDocuments()
    .then(num => {
      response.send(`Phonebook has info for ${num} people <br/>
            ${Date()}`)
    })
})

app.post('/api/persons', (request, response, next) => {

  const body = request.body

  Person
    .find({ name: body.name })
    .then(personList => {
      if ((personList.length) !== 0) {
        response.status(400).send({ error: 'name already present' })
      }
      else {
        Person
          .create({ name: body.name, number: body.number })
          .then(newPerson => {
            response.json(newPerson)
          })
          .catch(error => next(error))
      }
    })

})

app.delete('/api/persons/:id', (request, response,next) => {

  Person.findByIdAndRemove(request.params.id)
    .then (() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


// Error Handling middleware

const unknownEndpoint = (request,response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.error(error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
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
