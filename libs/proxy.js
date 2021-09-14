const http = require('http');
const fs = require('fs');
const EventEmitter = require('events');

const alerts = require('./alerts.js');
const logger = require('./logs.js');
const ips = require('./ips.js');
const analytics = require('./analytics.js');

const eventEmitter = new EventEmitter();

exports.api = eventEmitter

exports.run = function(){
    http.createServer(async (client_req, client_res) => {
        eventEmitter.emit('request', client_req, client_res, async () => {
            if(!client_res.finished){
                let ip = client_req.headers['cf-connecting-ip'] || client_req.socket.remoteAddress;
                let domain = client_req.headers['host'];
                let path = client_req.url;
                let headers = client_req.headers;
                let method = client_req.method;
                let rootDomain = getDomain(domain);
        
                logger.info(ip+' Requested '+method+' '+domain+path, client_req.headers['cf-ipcountry']);
        
                analytics.request();
                if(!ips.check(ip))analytics.visitor();
        
                if(client_req.headers['cf-ipcountry'])analytics.country(client_req.headers['cf-ipcountry'])
        
                if(!await ips.checkIp(ip)){
                    logger.warn('Banned IP: '+ip+' Requested '+method+' '+domain+path, client_req.headers['cf-ipcountry']);
        
                    client_res.writeHead(404, {'Content-Type': 'text/html'});
                    client_res.end(fs.readFileSync('templates/ban.html'));
                
                    return;
                }
        
                if(client_req.url === '/api/v1/server/checkDomain'){
                    client_res.writeHead(200, {'Content-Type': 'text/plain'});
                    client_res.end('Hello From Phaze! REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
        
                    return;
                }
        
                //console.log(ip, date, domain, rootDomain, path, method, headers);
        
                let domainData = JSON.parse(fs.readFileSync('data/domains.json'));
        
                let domainDNS = domainData.data.find(x => x.name === rootDomain);
        
                if(!domainDNS){
                    client_res.writeHead(404, {'Content-Type': 'text/html'});
                    client_res.end(fs.readFileSync('templates/404.html'));
                    
                    return;
                }
        
                let subDomain = getSubDomain(domain);
                let dns = domainDNS.dns.find(x => x.name === subDomain);
        
                if(!dns){
                    if(domainDNS.dns.find(x => x.name === '@') && subDomain === ''){
                        dns = domainDNS.dns.find(x => x.name === '@');
        
                        let options = {
                            hostname: dns.ip,
                            port: dns.port,
                            path: path,
                            method: method,
                            headers: headers
                        };
        
                        var proxy = http.request(options, function (res) {
                            client_res.writeHead(res.statusCode, res.headers)
                            res.pipe(client_res, {
                                end: true
                            });
                        });
                
                        proxy.on('error', function(err1){
                            alerts.alert(err1.message);
        
                            client_res.writeHead(404, {'Content-Type': 'text/html'});
                            client_res.end(fs.readFileSync('templates/500.html'));
        
                            logger.error(err1, client_req.headers['cf-ipcountry']);
                        })
                
                        client_req.pipe(proxy, {
                            end: true
                        })
        
                        return;
                    }
        
                    client_res.writeHead(404, {'Content-Type': 'text/html'});
                    client_res.end(fs.readFileSync('templates/404Sub.html'));
                    
                    return;
                }
        
                let options = {
                    hostname: dns.ip,
                    port: dns.port,
                    path: path,
                    method: method,
                    headers: headers
                };
        
                var proxy = http.request(options, function (res) {
                    client_res.writeHead(res.statusCode, res.headers)
                    res.pipe(client_res, {
                        end: true
                    });
                });
        
                proxy.on('error', function(err1){
                    alerts.alert(err1.message);
        
                    client_res.writeHead(404, {'Content-Type': 'text/html'});
                    client_res.end(fs.readFileSync('templates/500.html'));
        
                    logger.error(err1, client_req.headers['cf-ipcountry']);
                })
        
                client_req.pipe(proxy, {
                    end: true
                })
            }
        })
    }).listen(80);
}

let getDomain = fulldomain => {
    fulldomain = fulldomain.split('.');
    fulldomain = fulldomain.slice(fulldomain.length - 2);

    return fulldomain.join('.');
}

let getSubDomain = fulldomain => {
    fulldomain = fulldomain.split('.');
    fulldomain = fulldomain.slice(0, fulldomain.length - 2);

    return fulldomain.join('.');
}