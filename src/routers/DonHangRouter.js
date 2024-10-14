const express = require('express')
const { postDonHang } = require('../controllers/DonHangController')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()


router.post('/',protect,postDonHang)
module.exports = router