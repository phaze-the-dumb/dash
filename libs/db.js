const mongoose = require("mongoose");

exports.run = function(){
    mongoose.connect("", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}
