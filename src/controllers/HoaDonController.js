const HoaDon = require('../models/HoaDon')
const HoaDonCT = require('../models/DonHangCT')


exports.getListHoaDonALL = async (req, res) => {
    console.log('vào đây');
    
    try {
        const listHD = await HoaDon.find().populate({
            path:'idDonHang',
            populate: [
                {
                    path: 'idKhachHang',
                    select: 'HoTen'
                },
                {
                    path: 'idAdmin',
                    select: 'HoTen'
                }
            ]
        })
        if (listHD.length == 0) return res.status(404).json({ message: 'Cửa hàng chưa bán được sản phẩm nào' })
        res.status(200).json({ message: 'Hiển thị danh sách hóa đơn thành công', data: listHD })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getListHoaDon_KhachHang = async (req, res) => {
    try {
        const idKhachHang = req.user._id
        const listHD = await HoaDon.find({ idKhachHang })
        if (listHD.length === 0) return res.status(404).json({ message: 'Bạn chưa mua sản phẩm nào' })
        res.status(200).json({ message: 'Hiển thị danh sách hóa đơn thành công', data: listHD })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


