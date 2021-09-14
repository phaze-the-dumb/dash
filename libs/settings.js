exports.run = function(){
    const app = require('./webServer.js').getApp();
    const CryptoJS = require('crypto-js');
    const fs = require('fs');
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    
    app.post('/api/v1/settings/user', (req, res) => {
        if(!req.cookies)return res.send('Not logged in');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.send('Not logged in');
        if(userData.password != req.cookies._ptoken)return res.send('Not logged in');
    
        if(req.headers.password !== ""){
            userData.username = req.headers.username;
            userData.password = CryptoJS.SHA3(req.headers.password).toString();
            userData.avatar = req.headers.avatar;
            userData.ipinfoToken = req.headers.ipinfotoken;
        } else{
            userData.username = req.headers.username;
            userData.avatar = req.headers.avatar;
            userData.ipinfoToken = req.headers.ipinfotoken;
        }

        fs.writeFileSync('data/data.json', JSON.stringify(userData))

        res.send('ok');
    })

    app.post('/api/v1/domains/add', (req, res) => {
        if(!req.cookies)return res.send('Not logged in');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.send('Not logged in');
        if(userData.password != req.cookies._ptoken)return res.send('Not logged in');

        let domainObject = {
            name: req.headers.domain,
            zoneID: req.headers.zoneid,
            dns: []
        }

        fetch('https://'+domainObject.name+'/api/v1/server/checkDomain').then(data => data.text()).then(data => {
            console.log(data, 'http://'+domainObject.name+'/api/v1/server/checkDomain')
              
            if(data === 'Hello From Phaze! REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE'){
                let domains = JSON.parse(fs.readFileSync('data/domains.json'));
                domains.data.push(domainObject);

                fs.writeFileSync('data/domains.json', JSON.stringify(domains));

                res.send('ok');
            } else{
                res.send('Please point the domain to the server before adding it');
            }
        })
    })

    app.post('/api/v1/domains/:id/dns/edit', (req, res) => {
        if(!req.cookies)return res.send('Not logged in');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.send('Not logged in');
        if(userData.password != req.cookies._ptoken)return res.send('Not logged in');

        let dns = JSON.parse(req.headers.savedata);

        let domains = JSON.parse(fs.readFileSync('data/domains.json'));
        domains.data.find(x => x.name === req.params.id).dns = dns;

        fs.writeFileSync('data/domains.json', JSON.stringify(domains));

        res.send('ok');
    })
}
