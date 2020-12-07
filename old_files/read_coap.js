const coap = require('coap');
const EventEmitter = require('events')
const eventEmitter = new EventEmitter()
const util = require('./util.js')

const read_coap_protocol = (url_server, port_server) => new Promise((resolve) => {

    let req;
    var my_url = new URL(url_server);
    my_url.port = port_server;
    req = coap.request(my_url);
    req.end();
    req.on('response', function (res) {
        let value = res.payload.toString();
        resolve(value);
    });
})

exports.read_coap = read_coap_protocol
exports.visualize_coap =   function (url_server, port_server) {


    eventEmitter.on('start', async function () {

        try {

            let ris = await read_coap_protocol(url_server, port_server)
            console.log(ris)
            await util.sleep(2000) // sleeps two seconds then emits a new start event
            eventEmitter.emit('start')

        } catch (error) {
            console.log("Errore nella richiesta http")
            console.log(error)
        }

    })
    eventEmitter.emit('start')

}

//(async () => {let x = await read_coap('coap://localhost/andrea', 5683) ; console.log(x)})();

/*
setInterval(() => {
    read_coap('coap://localhost/prova',5683,function(value) {
    console.log(value);
});
}, 3000);*/