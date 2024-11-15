const express = require('express')
const router = express.Router()
const {getThongke} = require('../controllers/ThongkeController')
//Lấy danh sách thống kê về
router.get('/thongke',getThongke)
module.exports = router