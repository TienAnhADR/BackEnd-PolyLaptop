const User = require('../models/User')
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')

// tạo JWT
const generateToken = (user) => {
    return jwt.sign({ _id: user._id, Role: user.Role }, process.env.JWT_SECRET, {
        expiresIn: '10d' /// token tồn tại 10 ngày
    })
}
// tạo refeshToken
const generateRefeshToken = (user) => {
    return jwt.sign({ _id: user._id, Role: user.Role }, process.env.JWT_REFRESH_SECRE, {
        expiresIn: '30d' /// token tồn tại 30 ngày
    })
}

// đăng ký người dùng
exports.registerUser = async (req, res) => {
    const { UserName, Password } = req.body
    if (!UserName || !Password) return res.status(400).json({ message: 'Không để trống dữ liệu' })
    try {
        const userExitsts = await User.findOne({ UserName })
        if (userExitsts) return res.status(400).json({ message: "Người dùng đã tồn tại" })
        // tạo người dùng mới
        const user = await User.create({ UserName, Password })
        const AccessToken = generateToken(user)
        const RefeshToken = generateRefeshToken(user)

        user.RefeshToken = RefeshToken
        await user.save()
        // trả về token người dùng
        res.status(201).json({
            _id: user._id,
            UserName: user.UserName,
            Role: user.Role,
            AccessToken,
            RefeshToken

        })
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}
exports.loginUser = async (req, res) => {
    const { UserName, Password } = req.body
    if (!UserName || !Password) return res.status(400).json({ message: 'Không để trống dữ liệu' })
    try {
        const user = await User.findOne({ UserName })
        // console.log('abc');

        // const isMatch = await user.matchPassword(Password)
        // console.log(isMatch);
        if (user.Role !== 'Khách hàng') return res.status(400).json({ message: 'bạn không phải là khách hàng' })

        if (user && (await user.matchPassword(Password))) {
            const AccessToken = generateToken(user)
            const RefeshToken = generateRefeshToken(user)
            user.RefeshToken = RefeshToken
            await user.save()
            res.json({
                _id: user._id,
                UserName: user.UserName,
                HoTen: user.HoTen,
                Tuoi: user.Tuoi,
                Email: user.Email,
                Sdt: user.Sdt,
                Avatar: user.Avatar,
                DiaChi: user.DiaChi,
                Role: user.Role,
                AccessToken,
                RefeshToken

            })
        }
        else {
            res.status(401).json({ message: "UserName hoặc mật khẩu không đúng" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}
exports.loginAdmin = async (req, res) => {
    const { UserName, Password } = req.body
    if (!UserName || !Password) return res.status(400).json({ message: 'Không để trống dữ liệu' })
    try {
        const user = await User.findOne({ UserName })
        if (user.Role !== 'admin') return res.status(400).json({ message: 'bạn không phải là admin' })

        if (user && (await user.matchPassword(Password))) {
            const AccessToken = generateToken(user)
            const RefeshToken = generateRefeshToken(user)
            user.RefeshToken = RefeshToken
            await user.save()
            res.json({
                _id: user._id,
                UserName: user.UserName,
                HoTen: user.HoTen,
                Tuoi: user.Tuoi,
                Email: user.Email,
                Sdt: user.Sdt,
                Avatar: user.Avatar,
                DiaChi: user.DiaChi,
                Role: user.Role,
                AccessToken,
                RefeshToken

            })
        }
        else {
            res.status(401).json({ message: "UserName hoặc mật khẩu không đúng" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}
exports.refeshToken = async (req, res) => {
    const { RefeshToken } = req.body
    if (!RefeshToken) return res.status(403).json({ message: "Refesh token không được cung cấp" })
    try {
        // console.log(RefeshToken);

        // tìm người dùng có refesh token
        const user = await User.findOne({ RefeshToken })
        // console.log(user);

        if (!user) return res.status(402).json({ message: "Refesh token không hợp lệ" })
        // console.log(process.env.JWT_REFRESH_SECRE);

        // xác thực refesh token
        jwt.verify(RefeshToken, process.env.JWT_REFRESH_SECRE, (err, decoded) => {
            // console.log(decoded);

            if (err) {
                // console.log(err);

                return res.status(403).json({ message: err.message })
            }
            const newAccessToken = generateToken(user)
            res.json({ AccessToken: newAccessToken })
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}
exports.uploadAvatar = async (req, res) => {
    try {
        const _id = req.user._id
        if (!req.file) return res.status(400).json({ message: 'Không có file được tải lên' })
        const Avatar = `/uploads/${req.file.filename}`
        const user = await User.findById(_id)
        if (!user) return res.status(402).json({ message: 'Không tìm thấy người dùng' })
        user.Avatar = Avatar
        await user.save()
        res.status(200).json({ message: 'Cập nhật Avatar thành công', data: Avatar })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.getListUser = async (req, res) => {
    try {
        const Users = await User.find()
        if (!Users) return res.status(400).json({ message: 'Không tìm thấy người dùng nào' })
        res.status(200).json({ message: 'Lấy danh sách người dùng thành công', data: Users })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.updateUser = async (req, res) => {
    const _id = req.user._id
    const { HoTen, Tuoi, Email, Sdt, DiaChi } = req.body
    let Avatar = ''
    try {
        if (req.file) {
            Avatar = `/uploads/${req.file.filename}`
        }
        const checkMail = await User.findOne({ Email })
        if (checkMail) return res.status(400).json({ message: 'Email này đã có người sử dụng vui lòng nhập email khác' })
        const user = await User.findByIdAndUpdate(_id, { HoTen, Tuoi, Email, Sdt, Avatar, DiaChi }, { new: true })
        if (!user) return res.status(400).json({ message: 'Lỗi sửa user' })
        await user.save()
        res.status(200).json({ message: 'Cập nhật thông tin thành công', data: user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.DoiMK = async (req, res) => {
    const _id = req.user._id
    const { oldPassword, newPassword } = req.body
    try {
        const user = await User.findById(_id)
        if (!(await user.matchPassword(oldPassword))) return res.status(400).json({ message: 'Mật khẩu cũ của bạn không đúng' })
        const Password = await argon2.hash(newPassword)
        const newUser = await User.findByIdAndUpdate(_id, { Password }, { new: true })
        await newUser.save()
        res.status(200).json({ message: 'Đổi mật khẩu thành công', data: newUser })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.AddUserAdmin = async (req, res) => {

    const { UserName, Password, Role, HoTen, Tuoi, Email, Sdt, DiaChi } = req.body
    if (!UserName || !Password || !Role || !HoTen || !Tuoi || !Email || !Sdt || !DiaChi) return res.status(400).json({ message: 'Không để trống dữ liệu' })

    try {
        const userExitsts = await User.findOne({ UserName })
        if (userExitsts) return res.status(400).json({ message: "Người dùng đã tồn tại" })
        const checkEmail = await User.findOne({ Email })
        if (checkEmail) return res.status(400).json({ message: 'Email này đã có người dùng' })
        // tạo người dùng mới
        const user = await User.create({ UserName, Role, HoTen, Tuoi, Email, Sdt, DiaChi })
        await user.save()
        // trả về token người dùng
        res.status(201).json({
            message: 'Thêm người dùng thành công', data: user
        })
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}
exports.Logout = async (req, res) => {
    const _id = req.user._id
    try {
        const user = await User.findByIdAndUpdate(_id, {  RefeshToken: '' })
        if (!user) return res.status(404).json({ message: 'Không có người dùng' })
        await user.save()
        res.status(200).json({ message: 'Đăng xuất thành công' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}