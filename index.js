const fs = require('fs');

let i = 0
let libs = []

console.log('Loaded Library startup.js')

let lib1 = require('./libs/startup.js');

lib1.run()
libs.push(lib1)

i++

console.log('Loaded Library webServer.js')

let lib2 = require('./libs/webServer.js');

lib2.run()
libs.push(lib2)

i++

fs.readdir(__dirname + '/libs', async function(err, files){
    if(err)return console.log(err)

    files.forEach(file => {
        if(file != 'webServer.js' && file != 'startup.js'){
            console.log('Loaded Library '+file)

            let lib = require('./libs/'+file)
    
            lib.run()
            libs.push(lib)
    
            i++
        }
    })

    console.log('\n')
    console.log('Loaded '+i+' libraries')
    console.log('\n')
});