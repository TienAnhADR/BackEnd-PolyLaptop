const SanPhamRuiDoSchema = require('../models/SanPhamRuiDo')
const DonHangCTSchema = require('../models/DonHangCT')
const DonHang = require('../models/DonHang')
exports.createSPRD = async (req, res) => {
    try {
        const userId = req.user._id
        const idDonHangCT = req.params.id
        const HinhAnhMinhHoa = req.files.map(file => `/uploads/${file.filename}`)
        const { LyDo, Type } = req.body
        if (!HinhAnhMinhHoa || !LyDo || !idDonHangCT || !Type) {
            return res.status(400).json({ message: 'Thiếu thông tin' })
        }
        const checkDHCT = await DonHangCTSchema.findById(idDonHangCT).populate('idDonHang')
        if (!checkDHCT) return res.status(400).json({ message: 'ID đơn hàng chi tiết không tồn tại' })
        if (checkDHCT.idDonHang.idKhachHang.toString() !== userId.toString()) return res.status(400).json({ message: 'Bạn không có quyền báo cáo sản phẩm rủi do' })
        const checkSPRD = await SanPhamRuiDoSchema.findOne({ idDonHangCT })
        if (checkSPRD) return res.status(400).json({ message: 'Đơn hàng đã được báo cáo rủi do' })
        const sanphamruido = new SanPhamRuiDoSchema({ HinhAnhMinhHoa, LyDo, idDonHangCT, Type })
        await sanphamruido.save()
        res.status(201).json({ message: 'Báo cáo sản phẩm rủi do thành công', data: sanphamruido })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
exports.getListSPRD_Admin = async (req, res) => {
    try {
        const listSPRD = await SanPhamRuiDoSchema.find().populate({
            path: 'idDonHangCT',
            populate: {
                path: 'idDonHang'
            }
        })
        if (!listSPRD) return res.status(400).json({ message: 'Chưa có ai báo cáo sản phẩm rủi do' })
        res.status(200).json({ message: 'Hiển thị danh sách báo cáo sản phẩm rủi do thành công', data: listSPRD })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.getListSPRD_User = async (req, res) => {
    try {
        const userId = req.user._id
        const listSPRD = await SanPhamRuiDoSchema.find({ idDonHangCT: { $in: await DonHangCTSchema.find({ idDonHang: { $in: await DonHang.find({ idKhachHang: userId }) } }) } })
        .populate('idDonHangCT')
        if (!listSPRD) return res.status(400).json({ message: 'Bạn chưa báo cáo sản phẩm nào' })
        res.status(200).json({ message: 'Hiển thị danh sách báo cáo sản phẩm rủi do thành công', data: listSPRD })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}