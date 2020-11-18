const coap = require('coap');

 function read_coap(url_server, port_server) {


    return new Promise(function (resolve) {

        let req;
        var my_url = new URL(url_server);
        my_url.port = port_server;
        req = coap.request(my_url);
        req.end();
        req.on('response', function (res) {
            let value = res.payload.toString();
            resolve(value)
           // console.log("Valore = " + value)
        }
        )
    })
}

(async () => {let x = await read_coap('coap://localhost/andrea', 5683) ; console.log(x)})();

/*
setInterval(() => {
    read_coap('coap://localhost/prova',5683,function(value) {
    console.log(value);
});
}, 3000);*/