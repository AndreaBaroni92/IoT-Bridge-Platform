
function mqtt_to_coap(brokerAddress, brokerPort, topic) {
    var mqtt = require('mqtt');
    var client  = mqtt.connect({host:brokerAddress,port:brokerPort});
    var coap        = require('coap');
    var server      = coap.createServer();
    let t,m;
    

    server.on('request', function(req, res) {

        if ( (req.url).slice(1) == t ) {
            console.log('topic if = '+ t);
            console.log('message if  = '+ m);
            res.end(m,"UTF-8")
        }
        else{
            console.log('topic else = '+ t);
            console.log('message else  = '+ m);
            res.end()
        }
        
        });

    server.listen(function() {
        console.log('server coap started')
    })


    client.on('connect', function () {
        client.subscribe(topic);
    });

    client.on('message', function (topic, message) {
        t = topic.toString();
        m = message.toString();
        console.log(topic.toString()+ " : " + message.toString());
    });   
}

mqtt_to_coap('127.0.0.1',1883,'prova');