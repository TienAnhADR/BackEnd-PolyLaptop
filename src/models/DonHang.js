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
        enum: ['Chờ duyệt','Đang vận chuyển','Thành công', 'Hủy'],
        default:'Chờ duyệt'
    },
    Type:{
        type: String,
        enum: ['Thanh toán payment','Nhận hàng thanh toán','Thanh toán trực tiếp'],
        default:'Thanh toán trực tiếp'
    },
    TongTien: {
        type: Number
    }
    
})
// DonHangSchema.pre('save', async function(next) {
//      console.log('vào đây:', this);
    
//     try {
//         // Lấy tất cả các chi tiết đơn hàng theo id của đơn hàng
//         const chiTietDonHang = await DonHangCT.find({ idDonHang: this._id });
//         console.log(chiTietDonHang);
        

//         // Tính tổng tiền của đơn hàng
//         let totalAmount = 0;
//         chiTietDonHang.forEach(item => {
//             totalAmount += item.TongTien;  // Lấy tổng tiền từ từng chi tiết đơn hàng
//         });

//         // Cập nhật tổng tiền của đơn hàng
//         this.TongTien = totalAmount;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });
const DonHang = mongoose.model('donhang',DonHangSchema)
module.exports = DonHang