const ips = require('../db/ips.js');
const id = require('./createId.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.run = function(){
    const app = require('./webServer.js').getApp();

    app.post('/api/v1/ips/action/:type', async (req, res) => {
        let ip = await ips.findById(req.headers.id);
        if(!ip)return res.json({ error: true, msg: 'That IP doesn\'t exist' })

        if(req.params.type === "none"){
            if(ip.actions === "None"){
                res.json({ error: true, msg: 'This ip already has this action' })
            } else{
                fetch('https://api.cloudflare.com/client/v4/accounts/'+require('../data/cloudflare.json').accountId+'/firewall/access_rules/rules', {
                    headers: {
                        "X-Auth-Key": require('../data/cloudflare.json').apiKey,
                        "X-Auth-Email": require('../data/cloudflare.json').email,
                        "Content-Type": "application/json"
                    },
                    method: "GET"
                }).then(data => data.json()).then(data => {
                    let ipdata = data.result.find(x => x.configuration.value === ip.ip)

                    if(!ipdata){
                        res.json({ error: true, msg: 'An error occurred while finding this record on cloudflare you will have to go onto the cloudflare dashboard and manually delete it' });

                        ip.actions = 'None'
                        ip.save()

                        return;
                    }

                    fetch('https://api.cloudflare.com/client/v4/accounts/'+require('../data/cloudflare.json').accountId+'/firewall/access_rules/rules/'+ipdata.id, {
                        method: 'DELETE',
                        headers: {
                            "X-Auth-Key": require('../data/cloudflare.json').apiKey,
                            "X-Auth-Email": require('../data/cloudflare.json').email,
                            "Content-Type": "application/json"
                        }
                    }).then(data => data.json()).then(data => {
                        if(data.success){
                            ip.actions = 'None'
                            ip.save()

                            res.json({ error: false, msg: 'Set IP Actions to none' })
                        } else{
                            res.json({ error: true, msg: 'Failed to set IP Actions to none' })
                        }
                    })
                })
            }
        } else if(req.params.type === "challenge"){
            if(ip.actions === "Challenge"){
                res.json({ error: true, msg: 'This ip already has this action' })
            } else{
                fetch('https://api.cloudflare.com/client/v4/accounts/'+require('../data/cloudflare.json').accountId+'/firewall/access_rules/rules', {
                    method: 'POST',
                    headers: {
                        "X-Auth-Key": require('../data/cloudflare.json').apiKey,
                        "X-Auth-Email": require('../data/cloudflare.json').email,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        mode: "challenge",
                        configuration: {
                            target: "ip",
                            value: ip.ip
                        }
                    })
                }).then(data => data.json()).then(data => {
                    if(data.success){
                        ip.actions = 'Challenge'
                        ip.save()

                        res.json({ error: false, msg: 'Set IP Actions to challenge' })
                    } else{
                        res.json({ error: true, msg: 'Failed to set IP Actions to challenge' })
                    }
                })
            }
        } else if(req.params.type === "softblock"){
            if(ip.actions === "Soft Block"){
                res.json({ error: true, msg: 'This ip already has this action' })
            } else{
                ip.actions = 'Soft Block'
                ip.save()

                res.json({ error: false, msg: 'Set IP Actions to soft block' })
            }
        } else if(req.params.type === "hardblock"){
            if(ip.actions === "Hard Block"){
                res.json({ error: true, msg: 'This ip already has this action' })
            } else{
                fetch('https://api.cloudflare.com/client/v4/accounts/'+require('../data/cloudflare.json').accountId+'/firewall/access_rules/rules', {
                    method: 'POST',
                    headers: {
                        "X-Auth-Key": require('../data/cloudflare.json').apiKey,
                        "X-Auth-Email": require('../data/cloudflare.json').email,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        mode: "block",
                        configuration: {
                            target: "ip",
                            value: ip.ip
                        }
                    })
                }).then(data => data.json()).then(data => {
                    if(data.success){
                        ip.actions = 'Hard Block'
                        ip.save()

                        res.json({ error: false, msg: 'Set IP Actions to hard block' })
                    } else{
                        res.json({ error: true, msg: 'Failed to set IP Actions to hard block' })
                    }
                })
            }
        } else if(req.params.type === "jschallenge"){
            if(ip.actions === "JS Challenge"){
                res.json({ error: true, msg: 'This ip already has this action' })
            } else{
                fetch('https://api.cloudflare.com/client/v4/accounts/'+require('../data/cloudflare.json').accountId+'/firewall/access_rules/rules', {
                    method: 'POST',
                    headers: {
                        "X-Auth-Key": require('../data/cloudflare.json').apiKey,
                        "X-Auth-Email": require('../data/cloudflare.json').email,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        mode: "js_challenge",
                        configuration: {
                            target: "ip",
                            value: ip.ip
                        }
                    })
                }).then(data => data.json()).then(data => {
                    if(data.success){
                        ip.actions = 'JS Challenge'
                        ip.save()

                        res.json({ error: false, msg: 'Set IP Actions to js challenge' })
                    } else{
                        res.json({ error: true, msg: 'Failed to set IP Actions to js challenge' })
                    }
                })
            }
        } else{
            res.json({ error: true, msg: 'Thats not a supported action' })
        }
    })
}

exports.getAllIps = async () => {
    return await ips.find();
}

exports.check = async ip => {
    let ip2 = await ips.findOne({ ip: ip });
    if(ip2)return true;

    return false
}

exports.checkIp = async ip => {
    let ip2 = await ips.findOne({ ip: ip });
    if(!ip2)ip2 = await ips.create({
        _id: id.create(),
        ip: ip,
        actions: 'None',
    });

    if(ip2.actions === 'JS Challenge'){
        return true;
    } else if(ip2.actions === 'Hard Block'){
        return false;
    } else if(ip2.actions === 'Soft Block'){
        return false;
    } else if(ip2.actions === 'Challenge'){
        return true;
    } else if(ip2.actions === 'None'){
        return true;
    }
}