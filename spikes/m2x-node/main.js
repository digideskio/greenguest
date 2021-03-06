var M2X = require('m2x'),
    relayr = require('relayr');

var apiKey = process.env.M2X_API_KEY;
var deviceId = process.env.M2X_DEVICE_ID;

if (!apiKey) return console.log('Please set M2X_API_KEY environment variable first!');
if (!deviceId) return console.log('Please set M2X_DEVICE_ID environment variable first!');

var wunderAppId = process.env.WUNDER_APP_ID;
var wunderDevId = process.env.WUNDER_DEV_ID;
var wunderToken = process.env.WUNDER_TOKEN;
if (!wunderAppId) return console.log('Please set wunderAppId environment variable first!');
if (!wunderDevId) return console.log('Please set wunderDevId environment variable first!');
if (!wunderToken) return console.log('Please set wunderToken environment variable first!');


var m2x = new M2X(apiKey);

var sendToM2x = function(value, callback) {
  m2x.devices.setStreamValue(deviceId, 'towel', {value: value}, callback);
};

var relayrKeys = {
  app_id: wunderAppId,
  dev_id: wunderDevId,
  token:  wunderToken
};

relayr.connect(relayrKeys);

var watchingForTowelChange = 0;

relayr.listen(function(err,data){
  //fires for every sensor event
  if (err) {
    console.log("Oh No!", err)
  } else {
    console.log(data);
    if ((data.prox > 1500) && (watchingForTowelChange > 3)) {
      watchingForTowelChange = 0;
      sendToM2x(1, function(data) {
        console.log(data);
      })
    }
    if (data.prox < 1000) {
      watchingForTowelChange++;
    }
  }
});
