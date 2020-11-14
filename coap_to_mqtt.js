const mqtt = require('mqtt');
const coap = require('./read_coap.js');
function coap_to_mqtt(coap_address,coap_port,broker_address, broker_port) {

    var my_url = new URL(coap_address);
    
    var client  = mqtt.connect({host:broker_address,port:broker_port});

    client.on('connect', function () {
        setInterval(() => {
            coap.read_coap(coap_address,coap_port,function(value) {
                client.publish((my_url.pathname).slice(1), value)
            });
        }, 3000)
    });   
}

coap_to_mqtt('coap://coap.me/hello', 5683, 'localhost', 1883)