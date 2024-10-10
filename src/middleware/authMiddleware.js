const jwt = require('jsonwebtoken')
const User = require('../models/user')

const protect = async (req,res,next) =>{
    let token
    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        try {
            // lấy token từ header
            token = req.headers.authorization.split(' ')[1]
            // xác minh token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // lấy thông tin từ token
            req.user = await User.findById(decoded._id).select('-Password')
            next()
        } catch (error) {
            res.status(400).json({message:'Token không hợp lệ'})
        }
    }
    else{
        res.status(401).json({message: 'Không có token, quyền truy cập bị từ chối'})

    }

}

module.exports = {protect}