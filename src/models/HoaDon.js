const mongoose = require('mongoose')
const HoaDonSchema = new mongoose.Schema({
    idDonHang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'donhang',
        require: true
    },
    NgayNhanHang: {
        type: Date,
        default: Date.now()
    }
})
const HoaDon = mongoose.model('hoadon',HoaDonSchema)
module.exports = HoaDon