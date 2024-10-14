const mongoose = require('mongoose')
const DanhGiaSchema = new mongoose.Schema({
    idUser : {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'user'
    },
    idSanPham: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sanpham'
    },
    Diem:{
        type: Number,
        enum: [1,2,3,4,5],
        default: 4
    },
    NoiDung:{
        type: String,
    } 
})

const DanhGia = mongoose.model('danhgia',DanhGiaSchema)
module.exports = DanhGia