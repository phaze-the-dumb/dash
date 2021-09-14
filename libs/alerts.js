let alerts = []

exports.run = function(){
    const app = require('./webServer.js').getApp();
    const fs = require('fs');

    app.get('/api/v1/alerts', (req, res, next) => {
        if(!req.cookies)return res.redirect('/login');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.redirect('/login');
        if(userData.password != req.cookies._ptoken)return res.redirect('/login');

        res.json(alerts)
    })

    app.post('/api/v1/alerts/remove', (req, res, next) => {
        if(!req.cookies)return res.redirect('/login');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.redirect('/login');
        if(userData.password != req.cookies._ptoken)return res.redirect('/login');

        alerts = alerts.filter(alert => alert.message !== req.headers.name);
        res.send('e')
    })
}

exports.alert = (message, href) => {
    alerts.push({
        message, href
    })
}