const express = require('express')
const { postDonHang, getDonHang_Admin, getDonHang_KhachHang, duyetDonHang_Admin, huyDon_KhachHang, XacNhan_DonHang, huyDon_Admin } = require('../controllers/DonHangController')
const { protect, admin } = require('../middleware/authMiddleware')
const router = express.Router()

// mua hàng KHách hàng
router.post('/mua-hang',protect,postDonHang)

// hiển thị danh sách đơn hàng - Admin
router.post('/',protect,admin,getDonHang_Admin)

// hiển thị danh sách đơn hàng khách hàng
router.get('/',protect,getDonHang_KhachHang)

// duyệt đơn admin
router.post('/duyet-don/:id',protect,admin,duyetDonHang_Admin)

// hủy đơn - admin
router.post('/huy-admin/:id',protect,admin,huyDon_Admin)
// hủy đơn - khách hàng
router.post('/huy/:id',protect,huyDon_KhachHang)

// xác nhận đơn hàng - khách hàng

router.post('/xac-nhan-don/:id',protect,admin,XacNhan_DonHang)
module.exports = router