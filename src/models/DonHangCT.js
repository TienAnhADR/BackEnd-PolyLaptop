const mongoose = require('mongoose')
const SanphamCT = require('./ChiTietSP')
const DonHangCTSchema = new mongoose.Schema({
    idDonHang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'donhang',
        require: true
    },
    idSanPhamCT: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chitietsanpham',
        require: true
    },
    SoLuongMua: {
        type: Number,
        require: true
    },
    TongTien:{
        type:Number,
        
    }
})
DonHangCTSchema.pre('save', async function(next){
    //console.log('Vào đây:',this);
    
    try {
        //console.log(this.idSanPhamCT);
        
        const ctsp = await SanphamCT.findById(this.idSanPhamCT)
        if(!ctsp) return next(new Error('Sản phẩm không tồn tại'));

        // Tính tổng tiền: giá sản phẩm * số lượng mua
        this.TongTien = ctsp.Gia * this.SoLuongMua;
        
        next()
        } catch (error) {
        next(error)
    }
})
const DonHangCT = mongoose.model('chitietdh',DonHangCTSchema)
module.exports = DonHangCT