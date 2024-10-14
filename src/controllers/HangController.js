const Hang = require('../models/HangSP')
exports.getHang = async (req, res) => {
    const hang = await Hang.find()
    if (!hang) return res.status(400).json({ message: 'Không có hãng nào' })
    res.status(200).json({ message: 'Hiển thị danh sách thành công', data: hang })

}
exports.postHang = async (req, res) => {
    const { TenHang } = req.body
    if (!TenHang) return res.status(400).json({ message: 'Không để trống' })
    try {
        const check = await Hang.findOne({ TenHang })
        if (check) return res.status(401).json({ message: 'Hãng này đã tồn tại' })
        const newHang = await Hang.create({ TenHang })
        res.status(200).json({message: 'Thêm hãng mới thành công', data: newHang})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}