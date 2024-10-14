const DanhGia = require('../models/DanhGia')

exports.getListDanhGia = async (req, res) => {
    try {
        const listDanhGia = await DanhGia.find()
        if (!listDanhGia) return res.status(400).json({ message: 'Chưa có ai đánh giá sản phẩm này' })
        res.status(200).json({ message: 'Hiển thị danh sách đánh giá thành công', data: listDanhGia })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.postDanhGia = async (req, res) => {
    const idUser = req.user._id
    const {idSanPham,Diem,NoiDung} = req.body
    if(!idUser) res.status(400).json({message: 'Vui lòng đăng nhập'})
}