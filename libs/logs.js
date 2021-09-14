const logs = require('../db/logs.js');
const id = require('./createId.js');

exports.run = function(){}

exports.getLogs = async () => {
    let foundLogs = await logs.find();

    foundLogs = foundLogs.sort((a, b) => b.time - a.time)

    return foundLogs;
}

exports.info = (msg, country) => {
    logs.create({
        _id: id.create(),
        type: 'info',
        msg,
        time: Date.now(),
        country
    })
}

exports.warn = (msg, country) => {
    logs.create({
        _id: id.create(),
        type: 'warn',
        msg,
        time: Date.now(),
        country
    })
}

exports.error = (msg, country) => {
    logs.create({
        _id: id.create(),
        type: 'error',
        msg,
        time: Date.now(),
        country
    })
}