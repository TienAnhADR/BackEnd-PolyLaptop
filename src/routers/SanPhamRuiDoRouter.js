const express = require('express');
const router = express.Router();
const upload = require('../config/upload')
const {createSPRD, getListSPRD_Admin,getListSPRD_User} = require('../controllers/SanPhamRuiDoControler')
const { protect, admin } = require('../middleware/authMiddleware')
router.post('/create/:id',protect,upload.array('HinhAnh'), createSPRD)
router.get('/admin',protect,admin, getListSPRD_Admin)
router.get('/',protect,getListSPRD_User)
module.exports = router