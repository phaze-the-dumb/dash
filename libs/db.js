const mongoose = require("mongoose");

exports.run = function(){
    mongoose.connect("mongodb+srv://bot1:GfvzBk8bMuxbUX11@cluster0.rgll8.mongodb.net/DNS?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}