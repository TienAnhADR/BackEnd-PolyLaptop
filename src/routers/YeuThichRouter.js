const express = require('express')
const router = express.Router()
const {getListYeuThich, postSPYT, deleteSPYT} = require('../controllers/YeuThichController')
const {protect} = require('../middleware/authMiddleware')

// lấy danh sách sản phẩm yêu thích theo user

router.get('/',protect,getListYeuThich)

// thêm sản phẩm yêu thích theo user
router.post('/',protect,postSPYT)

// xóa sản phẩm yêu thích theo user
router.delete('/',protect,deleteSPYT)
module.exports = router