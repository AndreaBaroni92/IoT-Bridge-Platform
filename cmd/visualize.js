const read = require('./../display.js')
const util = require('./../util.js')
exports.command = 'visualize'
exports.description = 'visualize data received from protocols'
exports.builder = function (yargs) {
    return yargs
        .option('p', {
            alias: 'protocol',
            demandOption: true,
            requiresArg: true,
            nargs: 1,
            type: 'string',
            defaultDescription: 'insert a protocol for retrieving data',
            choices: ['mqtt', 'coap', 'http']

        })
        .option('h', {
            alias: 'host',
            demandOption: true,
            requiresArg: true,
            nargs: 1,
            type: 'string',
            defaultDescription: 'insert an addres '
        })
        .option('n', {
            alias: 'port-number',
            demandOption: true,
            requiresArg: true,
            nargs: 1,
            type: 'number',
            defaultDescription: 'insert a port number'
        })
        .option('t', {
            alias: 'topic',
            //demandOption: true,
            requiresArg: true,
            nargs: 1,
            type: 'string',
            defaultDescription: 'insert a topic for mqtt'
        })
        .option('min', {
            requiresArg: true,
            nargs: 1,
            type: 'number'
        })
        .option('max', {
            requiresArg: true,
            nargs: 1,
            type: 'number'
        })
        .check((argv, options) => {
            //console.log(argv.t);
            if (argv.p == 'mqtt') {
                if (!argv.t) {
                    throw new Error("you must specify a topic if you use mqtt ")
                }
            }
            if (Number.isNaN(argv.min) || Number.isNaN(argv.max)) {
                throw new Error("min or max option not valid")
            }
            return true
        })
}

exports.handler = function (argv) {
    let display = new read.ReadProtocol(argv.h, argv.n, argv.t, argv.min, argv.max)
    switch (argv.p) {
        case 'http':
            // http_util.visualize_http(argv.h, argv.n)
            display.visualize_http()
            break;
        case 'mqtt':
            display.read_mqtt((stream_r) => {
                stream_r.on('readable', () => {
                    let data;
                    let t, m;
                    while (data = stream_r.read()) {
                        t = data.topic.toString();
                        m = data.message.toString();
                        if (util.test(parseFloat(m), argv.min, argv.max)) { //filtra i dati se necessario
                            console.log("Topic : " + t)
                            console.log("Message : " + m)
                        }
                    }
                })
            })
            break;
        case 'coap':
            display.visualize_coap()
            break;
        default:
            break;
    }
}