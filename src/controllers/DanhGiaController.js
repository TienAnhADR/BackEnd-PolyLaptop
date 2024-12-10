const DanhGia = require('../models/DanhGia')
const DonHang = require('../models/DonHang')
const DonHangCT = require('../models/DonHangCT')
const HoaDon = require('../models/HoaDon')

exports.getListDanhGia_Admin = async (req, res) => {
    try {
        const listDanhGia = await DanhGia.find()
        if (!listDanhGia) return res.status(400).json({ message: 'Chưa có ai đánh giá sản phẩm nào' })
        res.status(200).json({ message: 'Hiển thị danh sách đánh giá thành công', data: listDanhGia })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.postDanhGia = async (req, res) => {
    const idUser = req.user._id
    const {Diem,NoiDung} = req.body
    const idDonHang = req.params.id
    try {
        const hoaDon = await HoaDon.findOne({idDonHang})
        if(!hoaDon) return res.status(400).json({message:'đơn hàng này của bạn chưa thành công'})
        
        const newDanhGia = new DanhGia({idUser,idHoaDon: hoaDon._id,Diem,NoiDung})
        await newDanhGia.save()
        res.status(200).json({message:'Đánh giá thành công đơn hàng', data: newDanhGia})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
exports.getListDanhGia_KhachHang = async (req,res) =>{
    try {
        const idSanPhamCT = req.params.id
        // lấy danh sách đơn hàng chi tiết theo id sản phẩm chi tiết
        const listDHCT = await DonHangCT.find({idSanPhamCT}).select('idDonHang')
        // lấy danh sách id đơn hàng 
        const listIdDonHang = listDHCT.map(it=>it.idDonHang)
        // lấy danh sách id hóa đơn theo danh sách id đơn hàng
        const idHoaDons = await HoaDon.find({idDonHang:{$in:listIdDonHang}}).select('_id')
        // lấy danh sách id hóa đơn
        const listIdHoaDon = idHoaDons.map(it=>it._id)
        // lấy danh sách đánh giá
        const listDanhGia = await DanhGia.find({idHoaDon:{$in:listIdHoaDon}}).populate('idUser','HoTen')
        res.status(200).json({message: 'Lấy danh sách đánh giá thành công', data: listDanhGia})

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
