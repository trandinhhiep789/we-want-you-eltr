var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PostSchema = new Schema({
    tieuDe:{
        type: String,
        required: true
    },
    noiDung: {
        type: String,
        required: true
    },
    diaChi: {
        type: String,
        default: "" 
    },
    luong: {
        type: String,
        default: "" 
    },
    create_date: {
        type: Date,
        default: Date.now
    },
    danhSachUngCuVien: [],
    // userId: Id của account Business
    userId: Schema.ObjectId,
    categoryId: Schema.ObjectId,
})

module.exports = mongoose.model('Post', PostSchema)