const Stream = require('stream')
const mqtt = require('mqtt')
const coap = require('coap');
const EventEmitter = require('events')
const axios = require('axios')
const util = require('./util.js')

exports.ReadProtocol = function (address, port, topic, min, max) {
    this.address = address
    this.port = port
    this.topic = topic
    this.min = min
    this.max = max
    this.read_mqtt = function (cb) {
        let readableStream = new Stream.Readable({ objectMode: true });
        let client = mqtt.connect({ host: this.address, port: this.port });
        readableStream._read = () => { };
        cb(readableStream);
        client.on('connect', () => {
            client.subscribe(this.topic);
        });

        client.on('message', (t, m) => {
            readableStream.push({ topic: t, message: m })

        });

    }

    this.read_coap = () => new Promise((resolve, reject) => {

        let req;
        let my_url = new URL(this.address);
        my_url.port = this.port;
        if (my_url.protocol != 'coap:') {

            reject("The url provided doesn't have protocol = coap")
        }
        req = coap.request(my_url)
        req.end();
        req.on('response', (res) => {
            let value = res.payload.toString();
            resolve(value);
        });
    })

    this.visualize_coap = () => {
        let eventEmitter = new EventEmitter()
        eventEmitter.on('start', async () => {

            try {

                let ris = await this.read_coap()

                if (util.test(parseFloat(ris), this.min, this.max)) { //filtra i risultati se passano il test
                    console.log(ris)
                }

                await util.sleep(2000) // sleeps two seconds then emits a new start event
                eventEmitter.emit('start')

            } catch (error) {
                console.log("Errore nella richiesta coap")
                console.log(error)
            }

        })
        eventEmitter.emit('start')

    }

    this.read_http = () => new Promise((resolve, reject) => {


        let input_url = new URL(this.address)
        input_url.port = this.port

        axios.get(input_url.href)
            .then(function (response) {

                let ris = (response.data).toString()
                resolve(ris)

            }).catch(function (error) {

                reject(error.message)

            })

    })

    this.visualize_http = () => {

        let eventEmitter = new EventEmitter()
        eventEmitter.on('start', async () => {

            try {

                let ris = await this.read_http()
                //console.log(ris)
                if (util.test(parseFloat(ris), this.min, this.max)) { //filtra i risultati se passano il test
                    console.log(ris)
                }
                await util.sleep(2000) // sleeps two seconds then emits a new start event
                eventEmitter.emit('start')

            } catch (error) {
                console.log("Errore nella richiesta http")
                console.log(error)
            }

        })
        eventEmitter.emit('start')

    }


}