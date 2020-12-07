const save_module = require('./../save.js')
exports.command = 'save'
exports.description = 'save data received from protocol in a influx db 2.0 timeseries database'
exports.builder = function (yargs) {
    return yargs
        .option('p', {
            alias: 'protocol',
            demandOption: true,
            requiresArg: true,
            nargs: 1,
            type: 'string',
            defaultDescription: 'insert a protocol for retrieving data to save in a database',
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
            type: 'nuber',
            defaultDescription: 'insert a port number for the specified protocol'
        })
        .option('t', {
            alias: 'topic',
            //demandOption: true,
            requiresArg: true,
            nargs: 1,
            type: 'string',
            defaultDescription: 'insert a topic for mqtt'
        })
        .option('token', {
            alias: 'tokenInflux',
            //        demandOption: true,
            requiresArg: true,
            hidden: true,
            nargs: 1,
            type: 'string'
        })
        .demandOption('token', "Devi specificare un token nel file json ")
        .option('org', {
            alias: 'organization',
            //        demandOption: true,
            requiresArg: true,
            hidden: true,
            nargs: 1,
            type: 'string'
        })
        .demandOption('org', "Devi specificare un organizzazione nel file json ")
        .option('bucket', {
            alias: 'bucketInflux',
            //        demandOption: true,
            requiresArg: true,
            hidden: true,
            nargs: 1,
            type: 'string'
        })
        .demandOption('bucket', "Devi specificare un bucket nel file json ")
        .option('url', {
            alias: 'urlInflux',
            //        demandOption: true,
            requiresArg: true,
            hidden: true,
            nargs: 1,
            type: 'string'
        })
        .demandOption('url', "Devi specificare un url nel file json dove si trova il database influx ")
        .option('mesurement', {
            // alias: 'urlInflux',
            //        demandOption: true,
            requiresArg: true,
            hidden: true,
            nargs: 1,
            type: 'string'
        })
        .demandOption('mesurement', "Devi specificare il campo mesurement nel file json dove si trova il database influx ")
        .option('field', {
            // alias: 'urlInflux',
            //        demandOption: true,
            requiresArg: true,
            hidden: true,
            nargs: 1,
            type: 'string'
        })
        .demandOption('field', "Devi specificare il campo field nel file json dove si trova il database influx ")
        .option('defaultTag', {
            // alias: 'urlInflux',
            //        demandOption: true,
            requiresArg: true,
            hidden: true,
            nargs: 1,
            type: 'string'
        })
        .option('c', {
            alias: 'influxConfig',
            demandOption: true,
            requiresArg: true,
            nargs: 1,
            config: true,
            defaultDescription: 'specify json file for influx option '
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

    const influx = new save_module.InfluxInstance(argv.token, argv.org, argv.bucket, argv.url, argv.mesurement, argv.field,
        argv.defaultTag, argv.h, argv.n, argv.t, argv.min, argv.max)
    switch (argv.p) {
        case 'http':
            influx.saveHttp()
            break;
        case 'mqtt':
            influx.saveMqtt()
            break;
        case 'coap':
            influx.saveCoap()
            break;
        default:
            break;
    }
    //console.log(argv);
}