const mongoose = require ('mongoose')

if (process.argv.length < 3) {
    console.log ("Not enough arguments")
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.9htvafn.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

mongoose.set('strictQuery', false)

if (process.argv.length == 3) {
   
    mongoose
        .connect(url)
        .then((response) => {
            console.log("phonebook:")
            Person.find({}).then(response => {
                response.forEach(person => {
                    console.log(person["name"] + person["number"])
                })
                mongoose.connection.close()
            })      
        })
        .catch((err) => console.log(err))

}

if (process.argv.length == 5) {

    const newName = process.argv[3]
    const newNumber = process.argv[4]

    const person = new Person ({
        name: newName,
        number: newNumber
    })

    mongoose
        .connect(url)
        .then(() => {
            return person.save()
        })
        .then(() => {
            console.log(`added ${newName} number ${newNumber} to phonebook`)
            mongoose.connection.close()
        })
        .catch((err) => console.log(err))

}