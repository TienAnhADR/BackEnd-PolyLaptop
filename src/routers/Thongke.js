const express = require('express')
const router = express.Router()
const {getThongke,getRevenueByDateRange} = require('../controllers/ThongkeController')
//Lấy danh sách thống kê về
router.get('/thongke',getThongke)
router.get('/thongke_ktg',getRevenueByDateRange)
module.exports = router