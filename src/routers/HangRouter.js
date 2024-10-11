const express = require('express')
const {getHang,postHang} = require('../controllers/HangController')
const {protect, admin} = require('../middleware/authMiddleware')
const router = express.Router()
// thêm hãng mới
router.get('/',protect,getHang)
// thêm hãng mới
router.post('/',protect,admin,postHang)

module.exports = router