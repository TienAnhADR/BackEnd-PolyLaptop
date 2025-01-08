const ChiTietSP = require('../models/ChiTietSP')
const DanhGia = require('../models/DanhGia')
const DonHangCT = require('../models/DonHangCT')
const HoaDon = require('../models/HoaDon')

// lấy toàn bộ chi tiết sản phẩm
exports.getListSanPhamCT = async (req, res) => {
    try {
        const listSanPhamCT = await ChiTietSP.find().populate({
            path: 'idSanPham',
            select: 'anhSP tenSP',
            populate: {
                path: 'idHangSP',
                select: 'TenHang'
            }
        })
        if (!listSanPhamCT) return res.status(400).json({ message: 'Hiện tại chưa có sản phẩm chi tiết nào' })
        res.status(200).json({ message: 'Hiển thị danh sách sản phẩm chi tiết thành công', data: listSanPhamCT })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// lấy chi tiết sản phẩm theo từng sản phẩm
exports.getListSP = async (req, res) => {
    const idSanPham = req.params.id
    try {
        const listSPCT = await ChiTietSP.find({ idSanPham }).populate({
            path: 'idSanPham',
            select: 'anhSP tenSP',
            populate: {
                path: 'idHangSP',
                select: 'TenHang'
            }
        })
        if (!listSPCT) return res.status(400).json({ message: 'Không có chi tiết sản phẩm nào mang mã sản phẩm này' })
        res.status(200).json({ message: `Hiển thị danh sách sản phẩm thành công`, data: listSPCT })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.postChiTietSP = async (req, res) => {
    const { idSanPham, MauSac, Ram, SSD, ManHinh, SoLuong, Gia, MoTa } = req.body
    if (!idSanPham || !ManHinh || !MauSac || !Ram || !SSD || !SoLuong || !Gia || !MoTa) {
        return res.status(400).json({ message: 'Không để trống dữ liệu' })
    }
    try {
        const check = await ChiTietSP.findOne({ idSanPham, MauSac, Ram, SSD, ManHinh, Gia })
        if (check) {
            check.SoLuong += SoLuong
            await check.save()
            return res.status(200).json({ message: 'Sản phẩm này đã có và thêm số lượng', data: check })
        }
        const newChiTietSP = await ChiTietSP.create({ idSanPham, MauSac, Ram, SSD, ManHinh, SoLuong, Gia, MoTa })
        res.status(200).json({ message: 'Thêm chi tiết sản phẩm thành công', data: newChiTietSP })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}
exports.updateSPCT = async (req, res) => {
    const _id = req.params.id
    const { MauSac, Ram, SSD, ManHinh, SoLuong, Gia, MoTa } = req.body
    if (!ManHinh || !MauSac || !Ram || !SSD || !SoLuong || !Gia || !MoTa) {
        return res.status(400).json({ message: 'Không để trống dữ liệu' })
    }
    try {
        const check = await ChiTietSP.findByIdAndUpdate(_id, { MauSac, Ram, SSD, ManHinh, SoLuong, Gia, MoTa }, { new: true })
        if (!check) return res.status(400).json({ message: 'Không có sản phẩm chi tiết nào mang id này' })
        res.status(200).json({ message: 'Update Sản phẩm chi tiết thành công', data: check })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.getListSP2 = async (req, res) => {
    try {
        const listSanPhamCT = await ChiTietSP.find().populate({
            path: 'idSanPham',
            select: 'anhSP tenSP',
            populate: {
                path: 'idHangSP',
                select: 'TenHang'
            }
        })
        if (!listSanPhamCT) return res.status(400).json({ message: 'Hiện tại chưa có sản phẩm chi tiết nào' })
        const result = await Promise.all(listSanPhamCT.map(async (it) => {
            const donHangCTs = await DonHangCT.find({ idSanPhamCT: it._id })
            const idDonHangs = donHangCTs.map(it => it.idDonHang)
            const hoaDons = await HoaDon.find({ idDonHang: { $in: idDonHangs } })
            const idHoaDons = hoaDons.map(it => it._id)
            const danhgia = await DanhGia.find({ idHoaDon: { $in: idHoaDons } })
            const danhGiaTB = danhgia.reduce((a, b) => a + b.Diem, 0) / danhgia.length
            return { ...it.toObject(), danhGiaTB }
        }))
        // console.log(result);

        res.status(200).json({ message: 'Hiển thị danh sách sản phẩm chi tiết thành công', data: result })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}