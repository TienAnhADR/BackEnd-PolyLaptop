const express = require('express')
const router = express.Router()
const { getListSP, getListSanPhamCT, postChiTietSP, updateSPCT,getListSP2 } = require('../controllers/ChiTietSPController')
const { protect, admin } = require('../middleware/authMiddleware')


router.get('/khach-hang', getListSP2)

// get toàn bộ danh sách sản phẩm chi tiết
router.get('/', getListSanPhamCT)

// get danh sách sản phẩm chi tiết theo mã sản phẩm
router.get('/:id', getListSP)

// thêm mới hoặc thêm số lượng ctsp
router.post('/', protect, admin, postChiTietSP)

// Update sản phẩm chi tiết
router.put('/:id', protect, admin, updateSPCT)


module.exports = router