const mongoose = require('mongoose')

const url = 'mongodb://fullstack:secret@ds223268.mlab.com:23268/fullstack_puhelinluettelo'

mongoose.connect(url)
mongoose.Promise = global.Promise

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.statics.format = function(person) {
    return ({
        name: person.name,
        number: person.number,
        id: person._id
    })
}
const Person = mongoose.model('Person', personSchema)

module.exports = Person