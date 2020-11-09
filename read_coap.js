const coap  = require('coap');

function read_coap(url_server, port_server) {

    let req;
    var my_url = new URL(url_server);
    my_url.port = port_server;
    req   = coap.request(my_url);
    req.end();
    req.on('response', function(res) {

        res.on('readable', () => {
            // There is some data to read now.
            let data;    
            while (data = res.read()) {
               
                console.log("Data = "+ data.toString());
            }
        });


    })
};
read_coap('coap://localhost/prova',5683);