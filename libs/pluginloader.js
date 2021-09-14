let i = 0
let plugins = []
let pluginNames = []

exports.run = function(){
    const fs = require('fs');
    fs.stat('pluginfiles', (err, stats) => {
        if(err)fs.mkdirSync('pluginfiles');
    })

    fs.readdir('plugins', async function(err, files){
        if(err)return console.log(err)

        console.log('Loading Plugins')

        files.forEach(file => {
            console.log('Loaded Plugin '+file)
            pluginNames.push(file)

            let plugin = require('../plugins/'+file)
    
            plugin.run()
            plugins.push(plugin)
    
            i++
        })

        console.log('Loaded '+i+' plugins')
        console.log('\n')
    });
}


exports.getPlugins = () => {
    return pluginNames;
}