const mongoose = require('mongoose')
const argon2 = require('argon2')
const UserSchema = new mongoose.Schema({
    UserName: {type: String, require: true},
    Password: {type: String},
    HoTen: {type: String},
    Tuoi: {type: Number},
    Email: {type: String, require: true},
    Sdt: {type: String, require: true},
    Avatar: {type: String},
    DiaChi: {type: String}
})
UserSchema.pre('save', async function (next) {
    if(this.isModified('Password')){
        try {
            this.Password = await argon2.hash(this.Password)
            
        } catch (error) {
            next(error)
        }
        
    }
    next()
    
})
UserSchema.methods.matchPassword = async function (enterdPassword) {
    try {
        return await argon2.verify(this.Password,enterdPassword)
    } catch (error) {
        throw new Error("Xác thực mật khẩu không thành công")
    }
}
const User = mongoose.model('user',UserSchema)
module.exports = User