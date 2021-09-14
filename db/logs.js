const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    _id: String,
    time: String,
    msg: String,
    type: String,
    country: String,
});

module.exports = mongoose.model('logs', schema)