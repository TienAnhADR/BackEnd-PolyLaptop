const express = require('express')
const { registerUser, loginUser, refeshToken, uploadAvatar, loginAdmin, getListUser, updateUser, DoiMK, AddUserAdmin, Logout } = require('../controllers/UserController')
const { protect, admin } = require('../middleware/authMiddleware')
const upload = require('../config/upload')
const router = express.Router()


// đăng ký người dùng
router.post('/register', registerUser)

// đăng nhập người dùng
router.post('/login', loginUser)

// đăng nhập admin
router.post('/login/admin', loginAdmin)

// RefeshToken
router.post('/refesh-token', refeshToken)

// cập nhật ảnh đại diện
router.put('/upload-avatar', protect, upload.single('avatar'), uploadAvatar)

// cập nhật thông tin
router.put('/user', protect, upload.single('avatar'), updateUser)

// login admin
router.get('/user', protect, admin, getListUser)

// đổi mật khẩu
router.put('/user/doi-mat-khau',protect,DoiMK)

// thêm người dùng mới (Admin)
router.post('/user', protect,admin,upload.single('avatar'),AddUserAdmin)

// đăng xuất
router.put('/logout',protect,Logout)

module.exports = router