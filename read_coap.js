const coap  = require('coap');

function read_coap(url_server, port_server) {

    let req;
    var my_url = new URL(url_server);
    my_url.port = port_server;
    req   = coap.request(my_url);
    req.end();
    req.on('response', function(res) {

        let value = res.payload.toString();
        console.log(value);

    })
};
setInterval(() => {read_coap('coap://localhost/prova',5683);}, 3000);