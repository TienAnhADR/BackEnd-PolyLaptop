const mongoose = require('mongoose')
const HangSchema = new mongoose.Schema({
    TenHang: {type: String, require:true}
})
const Hang = mongoose.model('hang',HangSchema)
module.exports = Hang