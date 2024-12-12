const SanPham = require('../models/SanPham')
const Hang = require('../models/HangSP')
exports.getSanPham = async (req, res) => {
    try {
        const sanpham = await SanPham.find().populate('idHangSP','TenHang','hang')
        
        if (!sanpham) return res.status(400).json({ message: 'Không có dữ liệu' })
            // console.log(sanpham);
            
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
        const anhSP = req.files.map(file => `/uploads/${file.filename}`)
        const newSanPham = await SanPham.create({ idHangSP, tenSP, anhSP })
        res.status(200).json({ message: 'Thêm sản phẩm mới thành công', data: newSanPham })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.updateSanPham = async (req, res) => {
    const _id = req.params.id;
    const { idHangSP, tenSP, selectedOldAnhSP } = req.body;

    // Kiểm tra đầu vào
    if (!_id || !idHangSP || !tenSP) 
        return res.status(400).json({ message: 'Không để trống dữ liệu' });

    try {
        // Parse danh sách ảnh cũ được giữ lại (nếu có)
        const retainedOldAnhSPList = selectedOldAnhSP ? JSON.parse(selectedOldAnhSP) : [];

        // Ảnh mới từ file upload
        const newAnhSPList = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        // Kết hợp ảnh cũ được giữ lại và ảnh mới
        const finalAnhSPList = [...retainedOldAnhSPList, ...newAnhSPList];

        // Cập nhật sản phẩm trong database
        const updateSP = await SanPham.findByIdAndUpdate(
            { _id },
            { idHangSP, tenSP, anhSP: finalAnhSPList },
            { new: true }
        );

        if (!updateSP) 
            return res.status(400).json({ message: 'Lỗi sửa sản phẩm' });

        res.status(200).json({ message: 'Sửa sản phẩm thành công', data: updateSP });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
