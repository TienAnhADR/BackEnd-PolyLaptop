const express = require('express')
const {registerUser,loginUser,refeshToken, uploadAvatar} = require('../controllers/UserController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../config/upload')
const router = express.Router()


// đăng ký người dùng
router.post('/register',registerUser)

// đăng nhập người dùng
router.post('/login',loginUser)

// RefeshToken
router.post('/refesh-token',refeshToken)

router.put('/upload-avatar/:id',protect,upload.single('avatar'),uploadAvatar)

module.exports = router