const SanPham = require('../models/SanPham')
exports.getSanPham = async (req, res) => {
    try {
        const sanpham = await SanPham.find()
        if (!sanpham) return res.status(400).json({ message: 'Không có dữ liệu' })
        res.status(200).json({ message: 'lấy danh sách sản phẩm thành công', data: sanpham })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.postSanPham = async (req, res) => {
    const { idHangSP, tenSP } = req.body

    if (!idHangSP || !tenSP) return res.status(400).json({ message: 'Không để trống dữ liệu' })

    // console.log(req.files, idHangSP , tenSP);

    if (!req.files || req.files.length === 0) return res.status(401).json({ message: 'Không có file tải lên' })

    try {
        const check = await SanPham.findOne({ idHangSP, tenSP })
        if (check) return res.status(400).json({ message: 'Sản phẩm này đã tồn tại' })
        const anhSP = req.files.map(file => `http://${process.env.IP}/${process.env.PORT}/uploads/${file.filename}`)
        const newSanPham = await SanPham.create({ idHangSP, tenSP, anhSP })
        res.status(200).json({ message: 'Thêm sản phẩm mới thành công', data: newSanPham })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.updateSanPham = async (req, res) => {
    const _id = req.params.id
    const { idHangSP, tenSP } = req.body
    if (!_id || !idHangSP || !tenSP) return res.status(400).json({ message: 'Không để trống dữ liệu' })
    if (!req.files || req.files.length === 0) return res.status(401).json({ message: 'Không có file tải lên' })
    try {
        const anhSP = req.files.map(file => `http://${process.env.IP}:${process.env.PORT}/uploads/${file.filename}`)
        const updateSP = await SanPham.findByIdAndUpdate({ _id }, { idHangSP, tenSP ,anhSP}, { new: true })
        if (!updateSP) return res.status(400).json({ message: 'Lỗi sửa sản phẩm' })
        res.status(200).json({ message: 'Sửa sản phẩm thành công', data: updateSP })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}