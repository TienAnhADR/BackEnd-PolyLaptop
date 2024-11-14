const express = require('express')
const router = express.Router()
const {getListHoaDonALL} = require('../controllers/HoaDonController')
const { protect, admin } = require('../middleware/authMiddleware')


// hiển thị danh sách hóa đơn admin
router.get('/admin',protect,admin,getListHoaDonALL)
module.exports = router