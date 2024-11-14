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
    },
    TongTien: {
        type: Number,
        require: true,
        default: 0
    }
})
const HoaDon = mongoose.model('hoadon',HoaDonSchema)
module.exports = HoaDon