const express = require('express')
const router = express.Router()
const {getSanPham,postSanPham, updateSanPham} = require('../controllers/SanPhamController')
const {protect, admin} = require('../middleware/authMiddleware')
const upload = require('../config/upload')

// lấy danh sách sản phẩm
router.get('/',getSanPham)

// thêm sản phẩm mới 
router.post('/',protect,admin,upload.array('anhSP'),postSanPham)

// update Sản phẩm
router.put('/:id',protect,admin,upload.array('anhSP'),updateSanPham)

module.exports = router
