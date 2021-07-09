var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
    tenUser:{
        type: String,
        required: true
    },
    moTa: {
        type: String,
        default: "" 
    },
    email:{
        type: String,
        required: true
    },
    soDienThoai:{
        type: String,
        default: "" 
    },
    passWord:{
        type: String,
        required: true
    },
    loaiUser:{
        type: [{
            type: String,
            enum: ['business','user', 'admin']
        }],
        default: ['user']
    },
    diaChi:{
        type: String,
        default: ""
    },
    mucTieuNgheNghiep:{
        type: String,
        default: ""
    },
    soNamKinhNghiem:{
        Number
    },
    hoVaTen:{
        type: String,
        default: ""
    },
    kinhNghiemLamViec:[],
    cacKiNang:[],
    soThich:[],
    hoatDong:[],
    nguoiThamChieu:[],
    tenTruong:{
        type: String,
        default: ""
    },
    tinhTrang: {
        type: [{
            type: String,
            enum: ['Chưa tốt nghiệm', 'Sắp tốt nghiệp', 'Tốt nghiệp']
        }],
        default: ['Tốt nghiệp']
    },
    create_date: {
        type: Date,
        default: Date.now
    },
    imageUrl: {
        type: String,
        default: ""
    },
    mauCvChinh: {
        type: String,
        default: "1"
    },
    imageUrlCover:[],
    categoryId: Schema.ObjectId,
})

module.exports = mongoose.model('User', UserSchema)