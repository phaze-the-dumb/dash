const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    _id: String,
    ip: String,
    actions: String,
    country: String,
});

module.exports = mongoose.model('ips', schema)