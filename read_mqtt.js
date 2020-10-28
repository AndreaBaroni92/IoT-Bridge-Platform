
exports.read_mqtt = function (brokerAddress, brokerPort, topic) {
    var mqtt = require('mqtt');
    var client  = mqtt.connect({host:brokerAddress,port:brokerPort});
    client.on('connect', function () {
        client.subscribe(topic);
    });

    client.on('message', function (topic, message) {
        console.log(topic.toString()+ " : " + message.toString());
    });   
}
