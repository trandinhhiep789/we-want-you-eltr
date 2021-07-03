var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CategoryModel = new Schema({
    tenLinhVuc: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    create_data: {
        type: Date,
        default: Date.now
    }
})

CategoryModel.path('tenLinhVuc').set((inputString) => {
    return inputString[0].toUpperCase() + inputString.slice(1)
})

module.exports = mongoose.model('Category', CategoryModel)