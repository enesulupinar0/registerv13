const mongoose = require('mongoose')
const Kayıtlar = mongoose.Schema({
    sunucu: String,
    user: String,
    yetkili: String,
    isimleri: String,
    isim: String,
    yaş: String,
    rolleri: String,
    sonİsimYaş: String,
    tarih: String,
})

module.exports = mongoose.model("Kayıtlar", Kayıtlar);