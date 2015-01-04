var CronJob = require('cron').CronJob,
    utils = require('./utils');

var M2X = require('m2x');
var apiKey = process.env.M2X_API_KEY;
var deviceId = process.env.M2X_DEVICE_ID;
if (!apiKey) return console.log('Please set M2X_API_KEY environment variable first!');
if (!deviceId) return console.log('Please set M2X_DEVICE_ID environment variable first!');

var m2x = new M2X(apiKey);

new CronJob('*/10 * * * * *', function(){
  //var temp = 70 + (Math.random()*10);
  utils.getThermostatAttributes().then(function(data) {
    console.log(data);
    console.log('Temperature reading is %sF. Sending to M2X', data.value);
    m2x.devices.setStreamValue(deviceId, 'temperature', {value: data.value}, function(data){
      console.log(data);
    });
  });

}, null, true, "America/Los_Angeles");
