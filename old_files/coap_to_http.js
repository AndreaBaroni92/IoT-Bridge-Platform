const express = require('express');
const app = express();
const read_c = require('./read_coap.js');

exports.coap_to_http = function (coap_address, port_coap, http_port) {


    let path = new URL(coap_address).pathname;

    app.get(path, async (req, res) => {

        try {

            res.on('timeout', function () {
                console.log("Intercettato timeout");
            })

            res.setTimeout(2000);
            console.log("Metodo " + req.method);
            req.on('close', function () {
                console.log("Connessione chiusa da client");
            })
            let ris = await read_c.read_coap(coap_address, port_coap);
            res.set('Content-Type', 'text/plain');
            console.log("Ricevuto " + ris);
            res.send(ris);

        } catch (error) {

            console.log("Errore ricevuto dal server coap ");
            console.log(error);

        }

    })

    app.listen(http_port, () => {
        console.log(`Example app listening at http://localhost:${http_port}`)
    })

}

//coap_to_http("coap://localhost/andrea", 5683, 3001)