const mongoose = require('mongoose')
const Yetkili = mongoose.Schema({
    sunucu: String,
    user: String,
    toplamkayıt: {type: Number, default: 0},
    erkekkayıt: {type: Number, default: 0},
    kadınkayıt: {type: Number, default: 0}  
})

module.exports = mongoose.model("Yetkili", Yetkili);