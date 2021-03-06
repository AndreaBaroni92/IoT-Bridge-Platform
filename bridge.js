const coap = require('coap')
const mqtt = require('mqtt')
const express = require('express')
const EventEmitter = require('events')
const read = require('./display.js')
const util = require('./util.js')
exports.bridge = Bridge
function Bridge(srcHost, srcPort, srcTopic, dstHost, dstPort, min, max) {

    this.dstHost = dstHost
    this.dstPort = dstPort
    read.ReadProtocol.call(this, srcHost, srcPort, srcTopic, min, max)

    this.http_to_coap = function () {

        let server = coap.createServer();
        let path = new URL(this.address).pathname;
        let ris;

        server.on('request', async (req, res) => {

            if ((req.url) == path) {

                try {
                    ris = await this.read_http(); // aspetta che la richista al server http dia risposta
                    if (util.test(parseFloat(ris), this.min, this.max)) {
                        res.end(ris, "UTF-8");
                    }
                    else {
                        res.end()
                    }

                } catch (error) {
                    console.log("Errore nella richiesta http ");
                    console.log(error);
                }

            } else {
                res.end();
            }
        })
        // the default CoAP port is 5683
        server.listen(this.dstPort);
    }

    this.coap_to_http = function () {
        let app = express()
        let ris

        let path = new URL(this.address).pathname;

        app.get(path, async (req, res) => {

            try {

                res.on('timeout', function () {
                    console.log("Intercettato timeout");
                })
                req.on('close', function () {
                    console.log("Connessione chiusa ");
                })
                ris = await this.read_coap();

                if (util.test(parseFloat(ris), this.min, this.max)) {
                    res.set('Content-Type', 'text/plain');
                    console.log("Ricevuto " + ris);
                    res.send(ris);
                }
                else {
                    res.end()
                }

            } catch (error) {
                console.log("Errore ricevuto dal server coap ");
                console.log(error);
            }

        })

        app.listen(this.dstPort, () => {
            console.log(`Example app listening at http://localhost:${this.dstPort}${path}`)
        })

    }


    this.mqtt_to_coap = function () {

        let server = coap.createServer()
        let t, m, data, ind
        let objsMqtt = []
        server.on('request', (req, res) => {


            if (util.findTopic(objsMqtt, req.url) === -1) {
                console.log("Non trovato");
                res.end()
            }
            else {
                res.end(objsMqtt[util.findTopic(objsMqtt, req.url)].value, "UTF-8")
            }

        })
        server.listen(this.dstPort, () => {
            console.log('server coap started')
        })

        this.read_mqtt((stream_r) => {
            stream_r.on('readable', () => {
                // There is some data to read now.
                while (data = stream_r.read()) {
                    t = data.topic.toString();
                    m = data.message.toString();
                    if (util.test(parseFloat(m), this.min, this.max)) {//passa il test
                        ind = util.findTopic(objsMqtt, '/' + t)
                        ind === -1 ? objsMqtt.push({ url: '/' + t, value: m }) : objsMqtt[ind].value = m
                        //console.log("Rivevuto " + m);
                        console.log(objsMqtt);
                        console.log("-------------------------");
                    }
                }
            })
        })

    }

    this.coap_to_mqtt = function () {


        let my_url = new URL(this.address)

        let client = mqtt.connect({ host: this.dstHost, port: this.dstPort })

        let eventEmitter = new EventEmitter()
        let value

        client.on('connect', async () => {

            eventEmitter.on('start', async () => {
                try {
                    value = await this.read_coap() // aspetta che la richiesta al server coap restituisca un messaggio
                    if (util.test(parseFloat(value), this.min, this.max)) {

                        client.publish((my_url.pathname).slice(1), value)
                        console.log((my_url.pathname).slice(1))
                        console.log('Valore ricevuto dal server coap e pubblicato')

                    }

                    await util.sleep(3000) // esegue una richiesta coap ogni 3 secondi
                    eventEmitter.emit('start')
                } catch (error) {
                    console.log("Errore nella lettura del server coap")
                    console.log(error)
                }

            })
            eventEmitter.emit('start')
        })

    }


    this.http_to_mqtt = function () {

        let my_url = new URL(this.address)

        let client = mqtt.connect({ host: this.dstHost, port: this.dstPort })

        let eventEmitter = new EventEmitter()

        client.on('connect', async () => {

            eventEmitter.on('start', async () => {

                try {
                    let value = await this.read_http() // aspetta che la richiesta al server http restituisca un messaggio

                    if (util.test(parseFloat(value), this.min, this.max)) {
                        client.publish((my_url.pathname).slice(1), value)
                        console.log((my_url.pathname).slice(1))
                        console.log('Valore ricevuto dal server http e pubblicato')
                    }
                    await util.sleep(3000) // esegue una richiesta http ogni 3 secondi
                    eventEmitter.emit('start')

                } catch (error) {
                    console.log("Errore nella lettura del server http")
                    console.log(error)
                    //eventEmitter.emit('start')
                }

            })
            eventEmitter.emit('start')
        })

    }

    this.mqtt_to_http = function () {

        let server = express()
        let t, m, data, ind;
        let objsMqtt = []

        server.get('*', (req, res) => {
            // console.log(this.topic);
            res.on('timeout', () => {
                console.log("Intercettato timeout");
            })
            req.on('close', function () {
                console.log("Connessione chiusa ");
            })

            if (util.findTopic(objsMqtt, req.path) === -1) {
                res.sendStatus(404)
            }
            else {
                res.send(objsMqtt[util.findTopic(objsMqtt, req.path)].value)
            }

        })
        server.listen(this.dstPort, () => {
            console.log(`Server started at port : ${this.dstPort} , 
            supplied topic : ${this.topic}`)
        })

        this.read_mqtt((stream_r) => {
            stream_r.on('readable', () => {
                // There is some data to read now.
                while (data = stream_r.read()) {
                    t = data.topic.toString();
                    m = data.message.toString();

                    if (util.test(parseFloat(m), this.min, this.max)) {//passa il test
                        ind = util.findTopic(objsMqtt, '/' + t)
                        ind === -1 ? objsMqtt.push({ url: '/' + t, value: m }) : objsMqtt[ind].value = m
                        console.log(objsMqtt);
                        console.log("-------------------------");
                    }

                }
            })
        })

    }

}

Bridge.prototype = Object.create(read.ReadProtocol.prototype)

Object.defineProperty(Bridge.prototype, 'constructor', {
    value: Bridge,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true
})