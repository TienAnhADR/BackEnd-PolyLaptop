const express = require('express');
const router = express.Router();
const upload = require('../config/upload')
const {createSPRD, getListSPRD_Admin,getListSPRD_User,Huy_SPRD_User,Huy_SPRD_Admin,XuLy_SPRD_Admin} = require('../controllers/SanPhamRuiDoControler')
const { protect, admin } = require('../middleware/authMiddleware')
router.post('/create/:id',protect,upload.array('HinhAnh'), createSPRD)
router.get('/admin',protect,admin, getListSPRD_Admin)
router.get('/',protect,getListSPRD_User)
router.post('/:id',protect, Huy_SPRD_User)
router.post('/admin/:id',protect,admin, Huy_SPRD_Admin)
router.post('/admin/xu-ly/:id',protect,admin, XuLy_SPRD_Admin)
module.exports = router