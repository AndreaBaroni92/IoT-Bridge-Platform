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

//===================================
/*
read_mqtt("localhost", 1883, 'temperature', function (stream_r) {
    stream_r.on('readable', () => {
        let data;
        let t,m;
        while (data = stream_r.read()) {
            t = data.topic.toString();
            m = data.message.toString();
            console.log("Topic : "+ t)
            console.log("Message : "+ m)
        }
    })
})*/