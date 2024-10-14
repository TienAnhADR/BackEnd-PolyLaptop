// const mongoose = require('mongoose')
const DonHangSchema = require('../models/DonHang')
const DonHangCT = require('../models/DonHangCT')
const HoaDonSchema = require('../models/HoaDon')
const SanphamCT = require('../models/ChiTietSP')
// let checkkk = 0

exports.getDonHang_Admin = async (req, res) => {
    try {
        const listDonHang = await DonHangSchema.find()
        if (listDonHang.length === 0) return res.status(404).json({ message: 'Chưa có ai đặt hàng' })
        res.status(200).json({ message: 'Hiển thị danh sách đơn hàng thành công', data: listDonHang })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getDonHang_KhachHang = async (req, res) => {
    try {
        const idKhachHang = req.user._id
        const listDonHang = await DonHangSchema.find({ idKhachHang })
        if (listDonHang.length === 0) return res.status(404).json({ message: 'Bạn chưa mua sản phẩm nào' })
        res.status(200).json({ message: 'Hiển thị danh sách đơn hàng của bạn thành công', data: listDonHang })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// exports.postDonHang = async (req, res) => {
//     try {
//         const idKhachHang = req.user._id

//         const { Type, SanPhamCTs } = req.body
//         if (SanPhamCTs.length === 0) return res.status(400).json({ message: 'Không để trống dữ liệu' })
//         if (Type === 'Thanh toán trực tiếp') {
//             const newDonHang = await DonHangSchema.create({ idKhachHang, TrangThai: 'Thành công', Type })
//             await newDonHang.save()
            
//             for(const item of SanPhamCTs){
//                 const spct = await SanphamCT.findById(item.idSanPhamCT)
//                 if(spct.SoLuong<item.SoLuongMua || spct.SoLuong <= 0){
//                      checkkk = 1
//                      break
//                 }

                
//                 const newDonHangCT = new DonHangCT({
//                     idDonHang: newDonHang._id,
//                     idSanPhamCT: item.idSanPhamCT,
//                     SoLuongMua: item.SoLuongMua
//                 })
//                 const newSL = spct.SoLuong - item.SoLuongMua
//                 if(checkkk>0){
//                     return checkkk
//                 }
//                 const updateSoLuongSPCT = await SanphamCT.findByIdAndUpdate(item.idSanPhamCT,{SoLuong: newSL},{new: true})
//                 // console.log(checkkk);
                
                
//                 await newDonHangCT.save()
//                 await updateSoLuongSPCT.save()
//             };
//             console.log(checkkk);
            
//             if(checkkk > 0) return res.status(400).json({message:`Sản phẩm nào đó không đủ số lượng bạn mua`})

//             const newHoaDon = new HoaDonSchema({
//                 idDonHang: newDonHang._id
//             })
//             await newHoaDon.save()
//             return res.status(200).json({ message: 'Mua Hàng thành công' })
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// }


exports.postDonHang = async (req, res) => {
    try {
        const idKhachHang = req.user._id;
        const { Type, SanPhamCTs } = req.body;

        if (SanPhamCTs.length === 0) return res.status(400).json({ message: 'Không để trống dữ liệu' });

        if (Type === 'Thanh toán trực tiếp') {
            const newDonHang = await DonHangSchema.create({ idKhachHang, TrangThai: 'Thành công', Type });
            await newDonHang.save();

            let checkkk = 0;

           
            for (const item of SanPhamCTs) {
                const spct = await SanphamCT.findById(item.idSanPhamCT);

                // Kiểm tra số lượng sản phẩm trong kho
                if (spct.SoLuong < item.SoLuongMua || spct.SoLuong <= 0) {
                    checkkk = 1;
                    break; // Nếu một sản phẩm không đủ, dừng kiểm tra
                }

                const newDonHangCT = new DonHangCT({
                    idDonHang: newDonHang._id,
                    idSanPhamCT: item.idSanPhamCT,
                    SoLuongMua: item.SoLuongMua
                });

                const newSL = spct.SoLuong - item.SoLuongMua;

                const updateSoLuongSPCT = await SanphamCT.findByIdAndUpdate(item.idSanPhamCT, { SoLuong: newSL }, { new: true });

                await newDonHangCT.save();
                await updateSoLuongSPCT.save();
            }

            // Nếu có sản phẩm không đủ số lượng
            if (checkkk > 0) {
                return res.status(400).json({ message: `Sản phẩm nào đó không đủ số lượng bạn mua` });
            }

            // Tạo hóa đơn
            const newHoaDon = new HoaDonSchema({
                idDonHang: newDonHang._id
            });
            await newHoaDon.save();

            return res.status(200).json({ message: 'Mua Hàng thành công' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};