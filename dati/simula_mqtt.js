var mqtt = require('mqtt');
var client  = mqtt.connect({host:'localhost',port:1883});

client.on('connect', function () {
    setInterval(() => {        
            client.publish('temperature', ((Math.random() * 3)+ 21).toFixed(2).toString() );
            client.publish('humidity', ((Math.random() * 10)+ 61).toFixed(2).toString() );        
    }, 2000)
});