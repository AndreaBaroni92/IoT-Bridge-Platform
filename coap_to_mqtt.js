const mqtt = require('mqtt');
const EventEmitter = require('events')
const coap = require('./read_coap.js');
const eventEmitter = new EventEmitter()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function coap_to_mqtt(coap_address, coap_port, broker_address, broker_port) {

    var my_url = new URL(coap_address);

    var client = mqtt.connect({ host: broker_address, port: broker_port });

    client.on('connect', async function () {

        try {
            eventEmitter.on('start', async () => {

                let value = await coap.read_coap(coap_address, coap_port); // aspetta che la richiesta al server coap restituisca un messaggio
                client.publish((my_url.pathname).slice(1), value)
                console.log((my_url.pathname).slice(1))
                console.log('Valore ricevuto dal server coap e pubblicato')              
                await sleep(3000) // esegue una richiesta coap ogni 3 secondi
                eventEmitter.emit('start')
            })

            eventEmitter.emit('start')

        } catch (error) {
            console.log("Errore nel server coap")
        }

    });
}

coap_to_mqtt('coap://coap.me/hello', 5683, 'localhost', 1883)