const express = require('express')
const {registerUser,loginUser} = require('../controllers/UserController')
const router = express.Router()

// đăng ký người dùng
router.post('/register',registerUser)

// đăng nhập người dùng
router.post('/login',loginUser)

module.exports = router