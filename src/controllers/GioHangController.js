const GioHang = require('../models/GioHang')
const ChiTietSP = require('../models/ChiTietSP')
exports.getGioHang = async (req, res) => {
    const idUser = req.user._id
    try {
        const listGioHang = await GioHang.find({idUser}).populate({
            path:'idChiTietSP',
            select: 'MauSac Ram SSD ManHinh SoLuong Gia MoTa',
            populate: {
                path:'idSanPham',
                select: 'tenSP anhSP'
            }
        })
        if (listGioHang.length === 0) return res.status(400).json({ message: 'Bạn chưa thêm sản phẩm nào vào giỏ hàng' })
        res.status(200).json({ message: 'Hiển thị danh sách giỏ hàng thành công', data: listGioHang })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.postGioHang = async (req, res) => {
    const idUser = req.user._id
    const { idChiTietSP } = req.body
    
    if (!idChiTietSP || !idUser) return res.status(400).json({ message: 'Không để trống dữ liệu' })
    
    try {        
        const check = await GioHang.findOne({ idUser, idChiTietSP })
        if (check) {
            return res.status(200).json({ message: 'Sản phẩm này trong giỏ hàng bạn đã có', data: check })
        }
        const newGioHang = await GioHang.create({ idChiTietSP, idUser})
        res.status(200).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công', data: newGioHang })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.deleteGioHang = async (req, res) => {
    const idUser = req.user._id
    const {idSanPhams} = req.body
    if(!idSanPhams || idSanPhams.length === 0) return res.status(400).json({message: 'Danh sách xóa sản phẩm trống'})
    try {
        const deleteGH = await GioHang.deleteMany({idUser,idChiTietSP: {$in: idSanPhams}})
        if(deleteGH.deletedCount === 0) return res.status(404).json({message:'Không tìm thấy sản phẩm nào để xóa'})
            res.status(200).json({message:'Xóa sản phẩm khỏi giỏ hàng thành công', data: deleteGH})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.deleteGioHang2 = async (req,res) =>{
    const _id = req.params.id
    const idUser = req.user._id
    try {
        const check = await GioHang.findOne({_id,idUser})
        if(!check) return res.status(400).json({message:'Lỗi logic backend'})
        const deleteGioHang = await GioHang.findByIdAndDelete(_id)
        res.status(200).json({message:'Xóa sản phẩm khỏi giỏ hàng thành công', data: deleteGioHang})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}