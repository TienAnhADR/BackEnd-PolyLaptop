const mongoose = require('mongoose')
const DonHangCT = require('./DonHangCT')
const DonHangSchema = new mongoose.Schema({
    idKhachHang : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require:true
    },
    idAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    NgayDatHang: {
        type: Date,
        default: Date.now()
    },
    TrangThai: {
        type: String,
        enum: ['Chờ duyệt','Đang vận chuyển','Thành công'],
        default:'Chờ duyệt'
    },
    Type:{
        type: String,
        enum: ['Thanh toán payment','Nhận hàng thanh toán','Thanh toán trực tiếp'],
        default:'Thanh toán trực tiếp'
    }
    
})
const DonHang = mongoose.model('donhang',DonHangSchema)
module.exports = DonHang