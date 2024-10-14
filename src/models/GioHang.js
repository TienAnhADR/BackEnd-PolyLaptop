const mongoose = require('mongoose')
const GioHangSchema = new mongoose.Schema({
    idUser :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    idChiTietSP: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chitietsanpham',
        require: true
    }
})
const GioHang = mongoose.model('GioHang',GioHangSchema)
module.exports = GioHang