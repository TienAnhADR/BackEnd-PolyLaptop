const YeuThich = require('../models/YeuThich')


exports.getListYeuThich = async (req, res) => {
    try {
        const idUser = req.user._id
        const listSPYT = await YeuThich.find({ idUser })
        if (listSPYT.length === 0) return res.status(400).json({ message: 'Bạn chưa yêu thích sản phẩm nào' })
        res.status(200).json({ message: 'hiển thị danh sách sản phẩm yêu thích thành công', data: listSPYT })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.postSPYT = async (req, res) => {
    try {
        const idUser = req.user._id
        const { idSanPham } = req.body
        if (!idSanPham || !idUser) return res.status(400).json({ message: 'Không để trống dữ liệu' })
        const check = await YeuThich.findOne({ idSanPham, idUser })
        if (check) return res.status(401).json({ message: 'Sản phẩm này bạn đã yêu thích từ trước' })
        const newSPYT = await YeuThich.create({ idUser, idSanPham })
        res.status(200).json({ message: 'Thêm sản phẩm yêu thích thành công', data: newSPYT })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.deleteSPYT = async (req, res) => {
    try {
        const idUser = req.user._id
        const {idSanPham} = req.body
        if (!idSanPham || !idUser) return res.status(400).json({ message: 'Không để trống dữ liệu' })
        const deleteSP = await YeuThich.findOneAndDelete({ idSanPham, idUser })
        if (!deleteSP) return res.status(400).json({ message: 'Không tìm thấy sản phẩm cần xóa' })
        res.status(200).json({ message: 'Xóa sản phẩm yêu thích thành công' })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}