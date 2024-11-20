const mongoose = require('mongoose')
const argon2 = require('argon2')
const UserSchema = new mongoose.Schema({
    UserName: {type: String, require: true, unique: true},
    Password: {type: String, require: true},
    HoTen: {type: String},
    Tuoi: {type: Number},
    Email: {type: String, unique: true},
    Sdt: {type: String},
    Avatar: {type: String},
    DiaChi: {type: String},
    Role: {type: String, enum: ['admin','Khách hàng'], default: 'Khách hàng'},
    RefeshToken: {type: String}
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