const SanPhamRuiDoSchema = require('../models/SanPhamRuiDo')
const DonHangCTSchema = require('../models/DonHangCT')
const DonHang = require('../models/DonHang')
const HoaDon = require('../models/HoaDon')
const SanphamCT = require('../models/ChiTietSP')
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
        const checkHoaDon = await HoaDon.findOne({ idDonHang: checkDHCT.idDonHang._id })
        const now = new Date()
        const kq = Math.ceil(Math.abs(now - checkHoaDon.NgayNhanHang) / (1000 * 60 * 60 * 24))
        if (kq > 15) return res.status(400).json({ message: 'Đơn hàng đã quá thời gian báo cáo sản phẩm' })
        const sanphamruido = new SanPhamRuiDoSchema({ HinhAnhMinhHoa, LyDo, idDonHangCT, Type })
        await sanphamruido.save()
        res.status(201).json({ message: 'Báo cáo sản phẩm rủi do thành công', data: sanphamruido })
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Đơn hàng đã được báo cáo rủi do' })
        } else {
            res.status(500).json({ message: error.message })
        }

    }
}
exports.getListSPRD_Admin = async (req, res) => {
    try {
        const listSPRD = await SanPhamRuiDoSchema.find().populate({
            path: 'idDonHangCT',
            populate: {
                path: 'idDonHang',
                populate:{
                    path: 'idKhachHang',
                    select: 'HoTen Email Sdt'
                }
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
        const listSPRD = await SanPhamRuiDoSchema.find({
            idDonHangCT: {
                $in: await DonHangCTSchema.find({
                    idDonHang: {
                        $in: await DonHang.find({
                            idKhachHang: userId
                        })
                    }
                })
            }
        }).populate('idDonHangCT')
        if (listSPRD.length === 0) return res.status(400).json({ message: 'Bạn chưa báo cáo sản phẩm nào' })
        res.status(200).json({ message: 'Hiển thị danh sách báo cáo sản phẩm rủi do thành công', data: listSPRD })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.Huy_SPRD_Admin = async (req, res) => {
    try {
        const _id = req.params.id
        const SPRD = await SanPhamRuiDoSchema.findById(_id)
        if (!SPRD) return res.status(400).json({ message: 'Không tìm thấy sản phẩm rủi do' })
        if (SPRD.TrangThai === 'Hủy') return res.status(400).json({ message: 'Sản phẩm rủi do đã được hủy' })
        if (SPRD.TrangThai === 'Đã xử lý') return res.status(400).json({ message: 'Sản phẩm rủi do đã được xử lý' })
        const newSPRD = await SanPhamRuiDoSchema.findByIdAndUpdate(_id, { TrangThai: 'Hủy',NgayXuLy: Date.now() }, { new: true })
        await newSPRD.save()
        res.status(200).json({ message: 'Hủy sản phẩm rủi do thành công', data: newSPRD })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.Huy_SPRD_User = async (req, res) => {
    try {
        const _id = req.params.id
        const userId = req.user._id
        const SPRD = await SanPhamRuiDoSchema.findById(_id).populate({
            path: 'idDonHangCT',
            select: 'idDonHang',
            populate: {
                path: 'idDonHang',
                select: 'idKhachHang',
            }
        })
        if (!SPRD) return res.status(400).json({ message: 'Không tìm thấy sản phẩm rủi do' })
        if (SPRD.idDonHangCT.idDonHang.idKhachHang.toString() !== userId.toString()) return res.status(400).json({ message: 'Bạn không có quyền hủy sản phẩm rủi do này' })
        if (SPRD.TrangThai === 'Hủy') return res.status(400).json({ message: 'Sản phẩm rủi do đã được hủy' })
        if (SPRD.TrangThai === 'Đã xử lý') return res.status(400).json({ message: 'Sản phẩm rủi do đã được xử lý vui lòng liên hệ với admin' })
        const newSPRD = await SanPhamRuiDoSchema.findByIdAndUpdate(_id, { TrangThai: 'Hủy' }, { new: true })
        await newSPRD.save()
        res.status(200).json({ message: 'Hủy sản phẩm rủi do thành công', data: newSPRD })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.XuLy_SPRD_Admin = async (req, res) => {
    try {
        const _id = req.params.id // id sản phẩm rủi do
        const SPRD = await SanPhamRuiDoSchema.findById(_id)
        if (!SPRD) return res.status(400).json({ message: 'Không tìm thấy sản phẩm rủi do' })
        if (SPRD.TrangThai === 'Hủy') return res.status(400).json({ message: 'Sản phẩm rủi do đã được hủy' })
        if (SPRD.TrangThai === 'Đã xử lý') return res.status(400).json({ message: 'Sản phẩm rủi do đã được xử lý' })

        if (SPRD.Type === 'Hoàn tiền') {
            const DHCT = await DonHangCTSchema.findById(SPRD.idDonHangCT)
            const DH = await DonHang.findById(DHCT.idDonHang)
            DH.TongTien -= DHCT.TongTien
            const HD = await HoaDon.findOne({ idDonHang: DH._id })
            HD.TongTien -= DHCT.TongTien
            const SPCT = await SanphamCT.findById(DHCT.idSanPhamCT)
            SPCT.SoLuong += DHCT.SoLuongMua
            await DH.save()
            await HD.save()
            DHCT.TongTien = 0
            await SPCT.save()
            SPRD.NgayXuLy = new Date()
            SPRD.TrangThai = 'Đã xử lý'
            await SPRD.save()
            return res.status(200).json({ message: 'Xử lý sản phẩm rủi do thành công', data: SPRD })
        }
        if (SPRD.Type === 'Đổi trả') {
            const { idSPCT, SoLuongMua } = req.body
            console.log( SoLuongMua);
            
            const SPCT = await SanphamCT.findById(idSPCT)
            if (SPCT) {
                if (SPCT.SoLuong < SoLuongMua) return res.status(400).json({ message: 'Số lượng sản phẩm không đủ' })
                const DHCT = await DonHangCTSchema.findById(SPRD.idDonHangCT)
                const DH = await DonHang.findById(DHCT.idDonHang)
                DH.TongTien -= DHCT.TongTien
                const HD = await HoaDon.findOne({ idDonHang: DH._id })
                HD.TongTien -= DHCT.TongTien
                const newDHCT = await DonHangCTSchema.findByIdAndUpdate(SPRD.idDonHangCT, { idSanPhamCT: idSPCT, SoLuongMua }, { new: true })
                await newDHCT.save()
                DH.TongTien += newDHCT.TongTien
                HD.TongTien += newDHCT.TongTien
                await DH.save()
                await HD.save()
                SPRD.NgayXuLy = new Date()
                SPRD.TrangThai = 'Đã xử lý'
                await SPRD.save()
                return res.status(200).json({ message: 'Xử lý sản phẩm rủi do thành công', data: SPRD })
            }
            SPRD.NgayXuLy = new Date()
            SPRD.TrangThai = 'Đã xử lý'
            await SPRD.save()
            res.status(200).json({ message: 'Xử lý sản phẩm rủi do thành công', data: SPRD })

        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}