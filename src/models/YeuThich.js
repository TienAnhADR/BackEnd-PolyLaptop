const mongoose = require('mongoose')
const YeuThichSchema = new mongoose.Schema({
    idUser :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    idSanPham: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sanpham',
        require: true
    }
})
const YeuThich = mongoose.model('yeuthich',YeuThichSchema)
module.exports = YeuThich