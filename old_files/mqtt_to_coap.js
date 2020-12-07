const read_m = require('./read_mqtt.js');
const coap = require('coap');

exports.mqtt_to_coap = function (brokerAddress, brokerPort, topic,coapPort) {
    
    var server      = coap.createServer();
    let t,m;
    
    server.on('request', function(req, res) {
        console.log(req.url+ " "+t); 
        if ( (req.url).slice(1) == t ) { 
            console.log(req.url);           
            res.end(m,"UTF-8")
        }
        else{
            res.end()
        }        
        });

    server.listen(coapPort,function() {
        console.log('server coap started')
    });
    
    read_m.read_mqtt(brokerAddress,brokerPort,topic,function ( stream_r){
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

//mqtt_to_coap('localhost',1883,'temperature',5685);