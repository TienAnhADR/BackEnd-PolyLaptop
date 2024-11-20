const DonHangCT = require('../models/DonHangCT')

exports.getDonHangCT = async (req, res) =>{
    // console.log('get ctdh');
    
    try {
        const idDonHang = req.params.id
        const listDHCT = await DonHangCT.find({idDonHang}).populate({
            path: 'idSanPhamCT',
            select:'Gia',
            populate:{
                path: 'idSanPham',
                select: 'tenSP'
            }

        })
        if(listDHCT.length === 0) return res.status(404).json({message:'Không có dữ liệu'})
            res.status(200).json({message:'Hiển thị chi tiết dơn hàng thành công', data: listDHCT})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}