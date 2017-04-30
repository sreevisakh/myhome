#!/usr/bin/env node
const fs = require('fs');
const commandLineArgs = require('command-line-args')
const getUsage = require('command-line-usage')
const gpio = require('node-gpio');
const gpio = {};
const GPIO = gpio.GPIO;

const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'device', alias: 'd', type: String },
  { name: 'status', alias: 's', type: Number },
  {name : 'startup', type: Boolean}
]

const options = commandLineArgs(optionDefinitions)

function log(){
  if(!options.verbose){
    console.log = function(){}
  }
}

const devices = {
  "light" : 23,
  "fan" : 24
}

var deviceStatus = {};

(function(){

  if(Object.keys(options).length === 0){
    const sections = [
      {
        header: 'Automate your home',
        content: 'Use this cli to control Raspberry pi connected devices'
      },
      {
        header: 'Options',
        optionList: [
          {
            name: 'verbose',
            alias: 'v',
            typeLabel: '[underline]{boolean}',
            description: 'enable logging'
          },
          {
            name: 'device',
            alias: 'd',
            typeLabel: '[underline]{string}',
            description: 'name of the device'
          },
          {
            name: 'status',
            alias: 's',
            typeLabel: '[underline]{number}',
            description: '0 or 1 , turn on/off state of the device'
          },
          {
            name: 'help',
            alias: 'h',
            description: 'shows you this help'
          }
        ]
      }
    ]
    const usage = getUsage(sections)
    console.log(usage)
  }

  if(options.startup){
    onload();
  }
  else if("device" in options && "status" in options){
    change(options.device, options.status)
  }
  else{

  }

  //change(device, status)
})();

function onload(){
  fs.readFile('status.json', 'utf8', function (err, data) {
    if (err) {
      return log(err);
    }
    deviceStatus = JSON.parse(data)|| {};

    if(deviceStatus.light == '1') {
      change('light','1');
    }
    else if(deviceStatus.light == '0') {
      change('light','0');
    }

    if(deviceStatus.fan == '1') {
      change('fan','1');
    }
    else if(deviceStatus.fan == '0') {
      change('fan','0');
    }
  });
}

function change(id, status){
  log("Changing Device Status, Device:",id,"Status :",status)
  var port = devices[id];
  var device = new GPIO(port);
  device.open();
  device.setMode(GPIO.OUT);
  device.write(status)
  deviceStatus[id] = status;
  fs.writeFile('status.json', JSON.stringify(deviceStatus), (err) => {
    if (err) throw err;
    log('Status Saved to File');
  });
}
