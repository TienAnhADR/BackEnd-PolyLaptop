const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware')
const { getDonHangCT } = require('../controllers/DonHangCTControler')
router.get('/:id',getDonHangCT)
module.exports = router