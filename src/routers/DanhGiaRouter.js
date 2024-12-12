const express = require('express')
const router = express.Router()
const {getListDanhGia_Admin,postDanhGia,getListDanhGia_KhachHang} = require('../controllers/DanhGiaController')
const { protect, admin } = require('../middleware/authMiddleware')
const upload = require('../config/upload')

router.post('/:id',protect,upload.array('HinhAnh'),postDanhGia)
router.get('/',getListDanhGia_Admin)
router.get('/:id',getListDanhGia_KhachHang)

module.exports = router