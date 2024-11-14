const express = require('express')
const {registerUser,loginUser,refeshToken, uploadAvatar, loginAdmin, getListUser} = require('../controllers/UserController')
const { protect, admin } = require('../middleware/authMiddleware')
const upload = require('../config/upload')
const router = express.Router()


// đăng ký người dùng
router.post('/register',registerUser)

// đăng nhập người dùng
router.post('/login',loginUser)

// đăng nhập admin
router.post('/login/admin',loginAdmin)

// RefeshToken
router.post('/refesh-token',refeshToken)

router.put('/upload-avatar/:id',protect,upload.single('avatar'),uploadAvatar)

router.get('/user',protect,admin,getListUser)

module.exports = router