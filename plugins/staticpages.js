const UI = require('../libs/webui.js');
const proxy = require('../libs/proxy.js');
const logger = require('../libs/logs.js');
const ips = require('../libs/ips.js');
const app = require('../libs/webServer.js').getApp();
const libid = require('../libs/createId.js');
const fs = require('fs');

exports.run = () => {
    fs.stat('pluginfiles/staticpages', (err, stats) => {
        if(err){
            fs.writeFileSync('pluginfiles/staticpages.json', '[]');
            fs.mkdirSync('pluginfiles/staticpages');
            fs.writeFileSync('pluginfiles/staticpages.html', '<div class="row"><div class="col-md-3 px-md-1"><div class="form-group"><label>Domain</label><select class="form-control" id="domainlist" style="padding: 5px;"></select></div></div><div class="col-md-3 px-md-1"><div class="form-group"><label>Path</label><input id="path" type="text" class="form-control" placeholder="URL Path"></div></div><div class="col-md-3 px-md-1"><div class="form-group"><label>File</label><input id="file" type="file" style="opacity: 1; position: relative;"></div></div><button onclick="submit()" class="btn btn-fill btn-primary">Add</button></div><div id="container"></div><script>fetch(\'/api/v1/plugins/staticpages/getDomains\').then(data => data.json()).then(data => {let text = \'\';data.data.forEach(domain => {domain.dns.forEach(record => {if(record.name === \'@\'){text = text + \'<option value="\'+domain.name+\'">+domain.name+\'</option>\'; } else{text = text + \'<option value="\'+record.name + \'.\' + domain.name+\'">\'+record.name + \'.\' + domain.name+\'</option>\';};});});document.getElementById(\'domainlist\').innerHTML = text;});let submit = () => {let path = document.getElementById(\'path\').value;let domain = document.getElementById(\'domainlist\').value;let file = document.getElementById(\'file\');var reader = new FileReader();reader.onload = function(e) {var text = reader.result;let textValue = document.createElement(\'input\');textValue.type = \'text\';textValue.value = text.toString();fetch(\'/api/v1/plugins/staticpages/addpage\', {method: \'POST\',body: JSON.stringify({ text: text.toString() }),headers: {path, domain,data: textValue.value}).then(data => data.json()).then(data => {if(data.error){demo.showNotification(\'bottom\',\'left\', data.msg, \'\', \'danger\');} else{demo.showNotification(\'bottom\',\'left\', data.msg, \'\', \'info\');};});}reader.readAsBinaryString(file.files[0]);};setInterval(() => {fetch(\'/api/v1/plugins/staticpages/getconfig\').then(data => data.json()).then(data => {let text = \'\';data.forEach(file => {text = text + \'<div class="row" style="padding: 10px; "><h4>\'+file.domain + file.path+\' <button onclick="remove(\\\'\'+file.id+\'\\\')" class="btn btn-fill btn-primary">Remove</button></h4></div>\';});document.getElementById(\'container\').innerHTML = text;});}, 1000);let remove = id => {fetch(\'/api/v1/plugins/staticpages/remove\', {headers: {id: id}}).then(data => data.json()).then(data => {if(data.error){demo.showNotification(\'bottom\',\'left\', data.msg, \'\', \'danger\');} else{demo.showNotification(\'bottom\',\'left\', data.msg, \'\', \'info\');};});};</script>');

            start()
        } else{
            start()
        }
    })
}

let start = () => {
    let config = require('../pluginfiles/staticpages.json');

    UI.makeUI({
        name: 'Static Pages',
        file: 'staticpages.js',
        html: fs.readFileSync('pluginfiles/staticpages.html')
    });

    app.get('/api/v1/plugins/staticpages/getDomains', (req, res) => {
        if(!req.cookies)return res.json({ error: true, msg: 'No' })
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.json({ error: true, msg: 'No' })
        if(userData.password != req.cookies._ptoken)return res.json({ error: true, msg: 'No' })

        res.json(JSON.parse(fs.readFileSync('data/domains.json')));
    })

    app.get('/api/v1/plugins/staticpages/getconfig', (req, res) => {
        if(!req.cookies)return res.json({ error: true, msg: 'No' })
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.json({ error: true, msg: 'No' })
        if(userData.password != req.cookies._ptoken)return res.json({ error: true, msg: 'No' })

        res.json(config);
    })

    app.get('/api/v1/plugins/staticpages/remove', (req, res) => {
        if(!req.cookies)return res.json({ error: true, msg: 'No' })
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.json({ error: true, msg: 'No' })
        if(userData.password != req.cookies._ptoken)return res.json({ error: true, msg: 'No' })

        config = config.filter(x => x.id != req.headers.id);
        fs.writeFileSync('pluginfiles/staticpages.json', JSON.stringify(config))

        res.json({ error: false, msg: 'Removed Static Page' });
    })

    app.post('/api/v1/plugins/staticpages/addpage', (req, res) => {
        if(!req.cookies)return res.json({ error: true, msg: 'No' })
        //if(!sessions.check(req.cookies._token))return res.redirect('/login');
        let userData = JSON.parse(fs.readFileSync('data/data.json'));
        if(userData.username != req.cookies._utoken)return res.json({ error: true, msg: 'No' })
        if(userData.password != req.cookies._ptoken)return res.json({ error: true, msg: 'No' })

        let filedata = req.headers.data;
        let path = req.headers.path;
        let domain = req.headers.domain;

        let id = libid.create();

        fs.writeFileSync('pluginfiles/staticpages/'+id, filedata)

        config.push({
            path, domain, id
        })

        fs.writeFileSync('pluginfiles/staticpages.json', JSON.stringify(config))

        res.json({ error: false, msg: 'Uploaded file successfully' });
    })

    proxy.api.on('request', async (client_req, client_res, done) => {
        let ip = client_req.headers['cf-connecting-ip'] || client_req.socket.remoteAddress;
        let domain = client_req.headers['host'];
        let path = client_req.url;
        let method = client_req.method;

        if(!config.find(x => x.domain === domain && x.path === path))return;

        let page = config.find(x => x.domain === domain && x.path === path);

        logger.info(ip+' Requested '+method+' '+domain+path + ' -- Static Pages', client_req.headers['cf-ipcountry']);

        if(!await ips.checkIp(ip)){
            logger.warn('Banned IP: '+ip+' Requested '+method+' '+domain+path + ' -- Static Pages', client_req.headers['cf-ipcountry']);

            client_res.writeHead(404, {'Content-Type': 'text/html'});
            client_res.end(fs.readFileSync('templates/ban.html'));
        
            return;
        }

        client_res.writeHead(200, {'Content-Type': 'text/html'});
        client_res.end(fs.readFileSync('pluginfiles/staticpages/'+page.id));

        done()
    })
}