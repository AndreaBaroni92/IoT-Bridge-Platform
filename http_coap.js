var coap = require('coap')
var read_h = require('./read_http.js')


function http_to_coap(http_address, port_http, coap_port) {

  var server = coap.createServer();
  let path = new URL(http_address).pathname;

  server.on('request', async function (req, res) {

    if ((req.url) == path) {

      try {

        let ris = await read_h.read_http(http_address, port_http); // aspetta che la richista al server http dia risposta
        res.end(ris, "UTF-8");

      } catch (error) {

        console.log("Errore nella richiesta http ");
        console.log(error);

      }

    } else {

      res.end();

    }
  })

  // the default CoAP port is 5683
  server.listen(coap_port);

}

http_to_coap ("http://localhost/andrea",3001,5683)
