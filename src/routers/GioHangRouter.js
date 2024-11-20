const express = require('express')
const router = express.Router()
const { getGioHang, postGioHang, deleteGioHang, deleteGioHang2 } = require('../controllers/GioHangController')
const { protect } = require('../middleware/authMiddleware')

// hiển thị danh sách giỏ hàng
router.get('/',protect,getGioHang)

// thêm sản phẩm chi tiết vào giỏ hàng
router.post('/',protect,postGioHang)

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/',protect,deleteGioHang)

router.delete('/:id',protect,deleteGioHang2)

module.exports = router