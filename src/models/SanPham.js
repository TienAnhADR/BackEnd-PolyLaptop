const mongoose = require('mongoose')
const SanPhamSchema = new mongoose.Schema({
    idHangSP: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hang',
        require: true
    },
    tenSP: {
        type: String,
        require: true
    },
    anhSP: {type: [String]}
})
const SanPham = mongoose.model('sanpham',SanPhamSchema)
module.exports = SanPham