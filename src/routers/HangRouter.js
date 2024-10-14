const express = require('express')
const {getHang,postHang} = require('../controllers/HangController')
const {protect, admin} = require('../middleware/authMiddleware')
const router = express.Router()
// xem danh sách hãng
router.get('/',getHang)
// thêm hãng mới
router.post('/',protect,admin,postHang)

module.exports = router