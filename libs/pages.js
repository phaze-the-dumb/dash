exports.run = function(){
    const app = require('./webServer.js').getApp();
    const sessions = require('easysessions');
    const fs = require('fs');

    app.get('/login', (req, res) => {
        res.render('login.ejs', { session: sessions.create(60000) })
    })

    app.get('/', (req, res) => {
        if(!req.cookies)return res.redirect('/login');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.redirect('/login');
        if(userData.password != req.cookies._ptoken)return res.redirect('/login');

        res.render('home.ejs', { data: JSON.parse(fs.readFileSync('data/data.json')), analytics: require('./analytics.js'), theme: req.cookies.theme, dark: req.cookies.dark });
    })

    app.get('/logs', async (req, res) => {
        if(!req.cookies)return res.redirect('/login');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.redirect('/login');
        if(userData.password != req.cookies._ptoken)return res.redirect('/login');

        res.render('logs.ejs', { data: JSON.parse(fs.readFileSync('data/data.json')), logs: await require('./logs.js').getLogs(), theme: req.cookies.theme, dark: req.cookies.dark});
    })

    app.get('/alerts', (req, res) => {
        if(!req.cookies)return res.redirect('/login');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.redirect('/login');
        if(userData.password != req.cookies._ptoken)return res.redirect('/login');

        res.render('alerts.ejs', { data: JSON.parse(fs.readFileSync('data/data.json')), theme: req.cookies.theme, dark: req.cookies.dark});
    })

    app.get('/management', async (req, res) => {
        if(!req.cookies)return res.redirect('/login');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.redirect('/login');
        if(userData.password != req.cookies._ptoken)return res.redirect('/login');

        res.render('managment.ejs', { data: JSON.parse(fs.readFileSync('data/data.json')), ips: await require('./ips.js').getAllIps(), theme: req.cookies.theme, dark: req.cookies.dark});
    })

    app.get('/dmanagement', (req, res) => {
        if(!req.cookies)return res.redirect('/login');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.redirect('/login');
        if(userData.password != req.cookies._ptoken)return res.redirect('/login');

        res.render('dmanagment.ejs', { data: JSON.parse(fs.readFileSync('data/data.json')), domains: JSON.parse(fs.readFileSync('data/domains.json')).data, theme: req.cookies.theme, dark: req.cookies.dark });
    })

    app.get('/dmanagement/:domain', (req, res) => {
        if(!req.cookies)return res.redirect('/login');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.redirect('/login');
        if(userData.password != req.cookies._ptoken)return res.redirect('/login');

        res.render('domain.ejs', { data: JSON.parse(fs.readFileSync('data/data.json')), domain: JSON.parse(fs.readFileSync('data/domains.json')).data.find(x => x.name === req.params.domain), theme: req.cookies.theme, dark: req.cookies.dark });
    })

    app.get('/adddomain', (req, res) => {
        if(!req.cookies)return res.redirect('/login');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.redirect('/login');
        if(userData.password != req.cookies._ptoken)return res.redirect('/login');

        res.render('addDomain.ejs', { data: JSON.parse(fs.readFileSync('data/data.json')), theme: req.cookies.theme, dark: req.cookies.dark})
    })

    app.get('/user', (req, res) => {
        if(!req.cookies)return res.redirect('/login');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.redirect('/login');
        if(userData.password != req.cookies._ptoken)return res.redirect('/login');

        res.render('user.ejs', { data: JSON.parse(fs.readFileSync('data/data.json')), theme: req.cookies.theme, dark: req.cookies.dark });
    })

    app.get('/plugins', (req, res) => {
        if(!req.cookies)return res.redirect('/login');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.redirect('/login');
        if(userData.password != req.cookies._ptoken)return res.redirect('/login');

        res.render('plugins.ejs', { data: JSON.parse(fs.readFileSync('data/data.json')), plugins: require('./pluginloader.js').getPlugins(), theme: req.cookies.theme, dark: req.cookies.dark });
    })

    app.get('/plugin/:name', (req, res) => {
        if(!req.cookies)return res.redirect('/login');
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.redirect('/login');
        if(userData.password != req.cookies._ptoken)return res.redirect('/login');

        res.render('plugin.ejs', { data: JSON.parse(fs.readFileSync('data/data.json')), plugin: req.params.name, pdata: require('./webui.js').getUI(req.params.name), theme: req.cookies.theme, dark: req.cookies.dark });
    })
}