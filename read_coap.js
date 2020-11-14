const coap  = require('coap');

exports.read_coap =  function (url_server, port_server,cb) {

    let req;
    var my_url = new URL(url_server);
    my_url.port = port_server;
    req   = coap.request(my_url);
    req.end();
    req.on('response', function(res) {
        let value=res.payload.toString();
        cb(value);
    })
};
/*
setInterval(() => {
    read_coap('coap://localhost/prova',5683,function(value) {
        console.log(value);
    });
}, 3000);*/