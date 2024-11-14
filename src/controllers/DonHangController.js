// const mongoose = require('mongoose')
const DonHangSchema = require('../models/DonHang')
const DonHangCT = require('../models/DonHangCT')
const HoaDonSchema = require('../models/HoaDon')
const SanphamCT = require('../models/ChiTietSP')
// let checkkk = 0

exports.getDonHang_Admin = async (req, res) => {
    try {
        const listDonHang = await DonHangSchema.find().populate('idAdmin', 'HoTen').populate('idKhachHang', 'HoTen')
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
                    break;
                }

                const newDonHangCT = new DonHangCT({
                    idDonHang: newDonHang._id,
                    idSanPhamCT: item.idSanPhamCT,
                    SoLuongMua: item.SoLuongMua,
                    TongTien: item.SoLuongMua * spct.Gia
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
            const listDonHangCT = await DonHangCT.find({ idDonHang: newDonHang._id })
            let TongTien = 0
            if (!listDonHangCT) return res.status(400).json({ message: 'Lỗi tính tổng tiền hóa đơn' })
            listDonHangCT.map(donhangct => {
                TongTien = TongTien + donhangct.TongTien
            })
            const newHoaDon = new HoaDonSchema({
                idDonHang: newDonHang._id,
                TongTien
            });
            await newHoaDon.save();

            return res.status(200).json({ message: 'Mua Hàng thành công', data: newHoaDon });
        }

        // tạo đơn hàng mua online

        const newDonHang = await DonHangSchema.create({ idKhachHang, TrangThai: 'Chờ duyệt', Type });
        await newDonHang.save();

        let checkkk = 0;
        for (const item of SanPhamCTs) {
            const spct = await SanphamCT.findById(item.idSanPhamCT);

            // Kiểm tra số lượng sản phẩm trong kho
            if (spct.SoLuong < item.SoLuongMua || spct.SoLuong <= 0) {
                checkkk = 1;
                break;
            }

            const newDonHangCT = new DonHangCT({
                idDonHang: newDonHang._id,
                idSanPhamCT: item.idSanPhamCT,
                SoLuongMua: item.SoLuongMua,
                TongTien : item.SoLuongMua * spct.Gia
            });



            await newDonHangCT.save();

        }

        // Nếu có sản phẩm không đủ số lượng
        if (checkkk > 0) {
            return res.status(400).json({ message: `Sản phẩm nào đó không đủ số lượng bạn mua` });
        }
        res.status(200).json({ message: 'Đặt hàng thành công', data: newDonHang });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// duyệt đơn admin
exports.duyetDonHang_Admin = async (req, res) => {
    try {
        const _id = req.params.id
        const idAdmin = req.user._id
        const listCTDH = await DonHangCT.find({ idDonHang: _id })
        let checkSoLuong = 0
        for (const item of listCTDH) {
            const spct = await SanphamCT.findById(item.idSanPhamCT);
            if (spct.SoLuong < item.SoLuongMua || spct.SoLuong <= 0) {
                checkSoLuong = 1;
                break;
            }
            const newSL = spct.SoLuong - item.SoLuongMua;

            const updateSoLuongSPCT = await SanphamCT.findByIdAndUpdate(item.idSanPhamCT, { SoLuong: newSL }, { new: true });
            await updateSoLuongSPCT.save();

        }
        if (checkSoLuong > 0) {
            return res.status(400).json({ message: `Sản phẩm nào đó không đủ số lượng vui lòng nhập thêm hàng` });
        }

        const updateDonHang = await DonHangSchema.findByIdAndUpdate(_id, { TrangThai: 'Đang vận chuyển', idAdmin }, { new: true })
        res.status(200).json({ message: 'Duyệt đơn hàng thành công', data: updateDonHang })


    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

// hủy đơn hàng nếu đơn hàng chưa được duyệt
exports.huyDon_KhachHang = async (req, res) => {

    try {
        const _id = req.params.id
        const donHang = await DonHangSchema.findById(_id)
        if (donHang.TrangThai != 'Chờ duyệt') return res.status(400).json({ message: 'đơn hàng này đang giao không thể hủy' })
        const newDonHang = await DonHangSchema.findByIdAndUpdate(_id, { TrangThai: 'Hủy' })
        const listSPCT = await DonHangCT.find({ idDonHang: _id })
        // for (const item of listSPCT) {
        //     const spct = await SanphamCT.findById(item.idSanPhamCT)
        //     const newSL = spct.SoLuong + item.SoLuongMua;

        //     const updateSoLuongSPCT = await SanphamCT.findByIdAndUpdate(item.idSanPhamCT, { SoLuong: newSL }, { new: true });
        //     await updateSoLuongSPCT.save();

        // }
        newDonHang.save()
        res.status(200).json({ message: 'Hủy đơn thành công', data: newDonHang })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.XacNhan_DonHang = async (req, res) => {
    try {
        const _id = req.params.id
        const DonHang = await DonHangSchema.findById(_id)
        if (DonHang.TrangThai === 'Chờ duyệt') return res.status(400).json({ message: 'Đơn hàng chưa được duyệt từ Admin' })
        const newDonHang = await DonHangSchema.findByIdAndUpdate(_id, { TrangThai: 'Thành công' })
        const listDonHangCT = await DonHangCT.find({ idDonHang: _id })
        if (!listDonHangCT) return res.status(400).json({ message: 'Lỗi Khi tính tổng tiền hóa đơn' })
        let TongTien = 0
        if (!listDonHangCT) return res.status(400).json({ message: 'Lỗi tính tổng tiền hóa đơn' })
        listDonHangCT.map(donhangct => {
            TongTien = TongTien + donhangct.TongTien
        })
        const newHoaDon = new HoaDonSchema({
            idDonHang: newDonHang._id,
            TongTien
        });
        await newDonHang.save()
        await newHoaDon.save();
        res.status(200).json({ message: 'Nhận hàng thành công', data: newDonHang })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}