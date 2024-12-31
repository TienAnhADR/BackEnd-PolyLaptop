const mongoose = require('mongoose')
const SanPhamRuiDoSchema = new mongoose.Schema({
    idDonHangCT: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'chitietdh',
        unique : true
    },
    HinhAnhMinhHoa: {
        type: [String],
        require: true
    },
    LyDo:{
        type: String,
        enum: ['Sản phẩm không đúng như mô tả','Sản phẩm bị hỏng hóc hoặc lỗi','Giao nhầm hàng','Đổi ý hoặc không cần nữa','Mua nhầm sản phẩm'],
        require: true
    },
    Type:{
        type: String,
        enum: ['Đổi trả','Hoàn tiền'],
        require: true
    },
    TrangThai: {
        type: String,
        enum: ['Chờ xử lý','Đang xử lý','Đã xử lý','Hủy'],
        default: 'Chờ xử lý'
    },
    NgayYeuCau: {
        type: Date,
        default: Date.now()
    },
    NgayXuLy: {
        type: Date
    }
})
// SanPhamRuiDoSchema.pre('save', async function(next){
//     try {
//         console.log('Thêm thành công');
//         next()
        
//     } catch (error) {
//         if (error.code === 11000) {
//             console.error("Lỗi trùng lặp:", error.message);
//           } else {
//             console.error("Lỗi khác:", error);
//           }
//         next(error)
//     }
// })
const SanPhamRuiDo = mongoose.model('sanphamruido',SanPhamRuiDoSchema)
module.exports = SanPhamRuiDo