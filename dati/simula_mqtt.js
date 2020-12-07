var mqtt = require('mqtt');
var client  = mqtt.connect({host:'localhost',port:1883});

client.on('connect', function () {
    setInterval(() => {        
            client.publish('temperature', ((Math.random() * 3)+ 21).toFixed(2).toString() );       
    }, 1000)
});