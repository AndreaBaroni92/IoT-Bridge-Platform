const mqtt = require('./read_mqtt.js');
const coap = require('coap');

function mqtt_to_coap(brokerAddress, brokerPort, topic) {
    
    var server      = coap.createServer();
    let t,m;
    
    server.on('request', function(req, res) {

        if ( (req.url).slice(1) == t ) {            
            res.end(m,"UTF-8")
        }
        else{
            res.end()
        }        
        });

    server.listen(function() {
        console.log('server coap started')
    });
    
    mqtt.read_mqtt(brokerAddress,brokerPort,topic,function ( stream_r){
        stream_r.on('readable', () => {
            // There is some data to read now.
            let data;    
            while (data = stream_r.read()) {
                t = data.topic.toString();
                m = data.message.toString();
            }
        });
    });
}

mqtt_to_coap('127.0.0.1',1883,'prova');