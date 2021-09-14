const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

exports.run = function(){
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.raw());
    app.use(cookieParser());
        
    app.listen(100);
}

exports.getApp = function(){
    return app;
}
