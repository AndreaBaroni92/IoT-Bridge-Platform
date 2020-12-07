const express = require('express');
const coap = require('coap')
const mqtt = require('mqtt')
const EventEmitter = require('events')
const read_c = require('../read_coap.js');
const read_h = require('../read_http.js')
const read_m = require('../read_mqtt.js');
const util = require('../util.js')
const app = express();
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

exports.http_to_coap = function (http_address, port_http, coap_port) {

    let server = coap.createServer();
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


  exports.coap_to_mqtt = function (coap_address, coap_port, broker_address, broker_port) {

    let my_url = new URL(coap_address)

    var client = mqtt.connect({ host: broker_address, port: broker_port })

    const eventEmitter = new EventEmitter()

    client.on('connect', async function () {

        try {
            eventEmitter.on('start', async () => {

                let value = await read_c.read_coap(coap_address, coap_port) // aspetta che la richiesta al server coap restituisca un messaggio
                client.publish((my_url.pathname).slice(1), value)
                console.log((my_url.pathname).slice(1))
                console.log('Valore ricevuto dal server coap e pubblicato')
                await util.sleep(3000) // esegue una richiesta coap ogni 3 secondi
                eventEmitter.emit('start')
            })
        } catch (error) {
            console.log("Errore nel server coap")
        }
        eventEmitter.emit('start')
    })
}

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