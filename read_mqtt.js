exports.read_mqtt = function (brokerAddress, brokerPort, topic, cb) {
    var Stream = require('stream');
    var mqtt = require('mqtt');
    var readableStream = new Stream.Readable({ objectMode: true });
    var client = mqtt.connect({ host: brokerAddress, port: brokerPort });

    readableStream._read = () => { };
    cb(readableStream);
    client.on('connect', function () {
        client.subscribe(topic);
    });

    client.on('message', function (t, m) {
        readableStream.push({ topic: t, message: m })

    });

}
