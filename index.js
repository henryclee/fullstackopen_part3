require ('dotenv').config
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')
const person = require('./models/person')

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

app.post('/api/persons', (request, response) => {
    const body = request.body


    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'missing information'
        })
    }

/*
    else if (persons.filter(p => p.name === body.name).length > 0) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
*/

    const newPerson = new Person ({
        name: body.name,
        number: body.number || ""
    })

    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
