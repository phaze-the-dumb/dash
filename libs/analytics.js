const fs = require('fs');
const os = require("os");

let requests = 100;
let vistitors = 50;
let bots = 0;

let saveDataRequests = require('../data/saveDataReq.json');
let saveVistsDataRequests = require('../data/saveVistsDataReq.json');
let saveCpuData = require('../data/saveCpuData.json').average;
let saveCpuDataPeak = require('../data/saveCpuData.json').peak;

let botSaveData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let countrySaveData = {};

let run = function(){}

let request = () => {
    let time = (new Date()).getHours();

    saveDataRequests[time]++;
    requests++

    fs.writeFile('data/saveDataReq.json', JSON.stringify(saveDataRequests), (err, data) => {
        if(err)return console.error(err)
    });
}

let visitor = () => {
    let time = (new Date()).getHours();

    saveVistsDataRequests[time]++;
    vistitors++

    fs.writeFile('data/saveVistsDataReq.json', JSON.stringify(saveVistsDataRequests), (err, data) => {
        if(err)return console.error(err)
    });
}

let country = code => {
    if(countrySaveData[code]){
        countrySaveData[code]++
    } else{
        countrySaveData[code] = 1
    }
}

let checkCpu = () => {
    var startMeasure = cpuAverage();

    //Set delay for second Measure
    setTimeout(function() { 
        var endMeasure = cpuAverage(); 

        var idleDifference = endMeasure.idle - startMeasure.idle;
        var totalDifference = endMeasure.total - startMeasure.total;

        var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

        let time = (new Date()).getHours();
        saveCpuData[time] = percentageCPU;

        if(percentageCPU > saveCpuDataPeak[time]){
            saveCpuDataPeak[time] = percentageCPU;
        }

        fs.writeFile('data/saveCpuData.json', JSON.stringify({
            "average": saveCpuData,
            "peak": saveCpuDataPeak
        }), (err, data) => {
            if(err)return console.error(err)
        });
    }, 100);
}

module.exports = {
    run,
    country,
    visitor,
    request,
    getReqs: () => { return requests; },
    getVists: () => { return vistitors; },
    getSaveData: () => { return JSON.stringify(saveDataRequests); },
    getVistsSaveData: () => { return JSON.stringify(saveVistsDataRequests); },
    getBotsSaveData: () => { return JSON.stringify(botSaveData); },
    getDetectedBots: () => { return bots },
    getCpuSaveData: () => { return JSON.stringify(saveCpuData); },
    getCpuSaveDataPeak: () => { return JSON.stringify(saveCpuDataPeak); },
    getCountrySaveData: () => { return JSON.stringify(countrySaveData); }
}

checkCpu()
setInterval(checkCpu, 60000)

let currentDay = (new Date()).getDate()
setInterval(() => {
    if(currentDay !== (new Date()).getDate()){
        currentDay = (new Date()).getDate()

        saveDataRequests = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        saveVistsDataRequests = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        botSaveData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        saveCpuData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        fs.writeFile('data/saveVistsDataReq.json', JSON.stringify(saveVistsDataRequests), (err, data) => {
            if(err)return console.error(err)
        });

        fs.writeFile('data/saveCpuData.json', JSON.stringify(saveCpuData), (err, data) => {
            if(err)return console.error(err)
        });

        fs.writeFile('data/saveDataReq.json', JSON.stringify(saveDataRequests), (err, data) => {
            if(err)return console.error(err)
        });
    }
}, 60000)

// other function shit

function cpuAverage() {

    //Initialise sum of idle and time of cores and fetch CPU info
    var totalIdle = 0, totalTick = 0;
    var cpus = os.cpus();
  
    //Loop through CPU cores
    for(var i = 0, len = cpus.length; i < len; i++) {
  
      //Select CPU core
      var cpu = cpus[i];
  
      //Total up the time in the cores tick
      for(type in cpu.times) {
        totalTick += cpu.times[type];
     }     
  
      //Total up the idle time of the core
      totalIdle += cpu.times.idle;
    }
  
    //Return the average Idle and Tick times
    return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}