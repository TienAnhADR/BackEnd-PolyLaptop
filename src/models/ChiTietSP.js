const mongoose = require('mongoose')
const ChiTietSanPhamSchema = new mongoose.Schema({
    idSanPham:{ 
        type: mongoose.Types.ObjectId,
        ref: 'sanpham',
        require: true
    },
    MauSac: {
        type: String,
        require: true
    },
    Ram: {
        type: String,
        require: true
    },
    SSD: {
        type: String,
        require: true
    },
    ManHinh: {
        type: String,
        require: true
    },
    SoLuong: {
        type:Number,
        require: true
    },
    Gia:{
        type: Number,
        require: true
    },
    MoTa: {
        type: String,
        require: true
    }
})
const ChiTietSP = mongoose.model('chitietsanpham', ChiTietSanPhamSchema)
module.exports = ChiTietSP