exports.run = function(){
    const app = require('./webServer.js').getApp();
    const sessions = require('easysessions');
    const CryptoJS = require('crypto-js');
    const fs = require('fs');
    const alerts = require('./alerts.js');

    app.post('/api/v1/login', (req, res) => {
        let ip = req.headers['cf_connecting_ip'] || req.socket.remoteAddress

        alerts.alert('User attempted login from ' + ip, 'javascript:fetch(\'api/v1/alerts/remove\', {method: \'post\', headers: {name: \'' + 'User attempted login from ' + ip + '\'}});')

        let data = req.headers.authorization.split(';');

        let username = data[0];
        let session = sessions.check(data[1]);
        let password = CryptoJS.SHA3(data[2]).toString()

        if(!session)return res.send('sessionerror');

        let userData = JSON.parse(fs.readFileSync('data/data.json'));

        if(userData.username != username)return res.send('loginerror');
        if(userData.password != password)return res.send('loginerror');

        res.cookie('_utoken', username);
        res.cookie('_ptoken', password);
        res.cookie('_token', sessions.create1Time())

        res.send('ok');
    })
}