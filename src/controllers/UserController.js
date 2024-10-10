const User = require('../models/user')
const jwt = require('jsonwebtoken')

// tạo JWT
const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: '30d' /// token tồn tại 30 ngày
    })
}

// đăng ký người dùng
exports.registerUser = async (req, res) => {
    const { UserName, Password, HoTen, Tuoi, Email, Sdt, Avatar, DiaChi } = req.body
    try {
        const userExitsts = await User.findOne({ UserName })
        if (userExitsts) return res.status(400).json({ message: "Người dùng đã tồn tại" })
        // tạo người dùng mới
        const user = await User.create({ UserName, Password, HoTen, Tuoi, Email, Sdt, Avatar, DiaChi })
        // trả về token người dùng
        res.status(201).json({
            _id: user._id,
            HoTen: user.HoTen,
            Tuoi: user.Tuoi,
            Email: user.Email,
            Sdt: user.Sdt,
            Avatar: user.Avatar,
            DiaChi: user.DiaChi,
            UserName: user.UserName,
            token: generateToken(user._id)

        })
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}
exports.loginUser = async (req, res) => {
    const { UserName, Password } = req.body
    try {
        const user = await User.findOne({ UserName })
        // console.log('abc');
        
        // const isMatch = await user.matchPassword(Password)
        // console.log(isMatch);
        

        if (user && (await user.matchPassword(Password))) {
            res.json({
                _id: user._id,
                UserName: user.UserName,
                HoTen: user.HoTen,
                Tuoi: user.Tuoi,
                Email: user.Email,
                Sdt: user.Sdt,
                Avatar: user.Avatar,
                DiaChi: user.DiaChi,
                token: generateToken(user._id)

            })
        }
        else{
            res.status(401).json({message:"UserName hoặc mật khẩu không đúng"})
        }
    } catch (error) {
        res.status(500).json({message: error.message})

    }
}