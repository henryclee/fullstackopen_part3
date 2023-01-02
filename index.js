require ('dotenv').config
const express = require('express')
const app = express()
//const cors = require('cors')
const Person = require('./models/person')
const person = require('./models/person')

//app.use(cors())
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


    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'missing information'
        })
    }

    const newPerson = new Person ({
        name: body.name,
        number: body.number || ""
    })

    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

app.delete('/api/persons/:id', (request, response,next) =>{

    Person.findByIdAndRemove(request.params.id)
        .then (result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const update = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, update, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


// Error Handling middleware

const unknownEndpoint = (request,response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name = 'CastError') {
        return response.status(400).send({error: 'malformed id'})
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
