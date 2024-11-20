const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware')
const { getDonHangCT } = require('../controllers/DonHangCTControler')
router.get('/:id',protect,getDonHangCT)
module.exports = router