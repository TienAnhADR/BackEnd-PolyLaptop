const mongoose = require('mongoose')
const DanhGiaSchema = new mongoose.Schema({
    idUser : {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'user'
    },
    idHoaDon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hoadon'
    },
    Diem:{
        type: Number,
        enum: [1,2,3,4,5],
        default: 5,
        require: true
    },
    NoiDung:{
        type: String,
    },
    HinhAnh:{
        type: [String]
    }
})

const DanhGia = mongoose.model('danhgia',DanhGiaSchema)
module.exports = DanhGia