const bridge_module = require('./../bridge.js')

exports.command = 'translate'
exports.description = 'make a bridge between protocol'
exports.builder = function (yargs) {
    return yargs
        .option('sp', {
            alias: 'source_protocol',
            demandOption: true,
            requiresArg: true,
            nargs: 1,
            type: 'string',
            defaultDescription: 'insert a source protocol for retrieving data',
            choices: ['mqtt', 'coap', 'http']

        })
        .option('sh', {
            alias: 'source_host',
            demandOption: true,
            requiresArg: true,
            nargs: 1,
            type: 'string',
            defaultDescription: 'insert a source host for retrieving data'
        })
        .option('sn', {
            alias: 'source_port_number',
            demandOption: true,
            requiresArg: true,
            nargs: 1,
            type: 'nuber',
            defaultDescription: 'insert a source port number for retrieving data'
        })
        .option('st', {
            alias: 'source_topic',
            //demandOption: true,
            requiresArg: true,
            nargs: 1,
            type: 'string',
            defaultDescription: 'insert a source topic for mqtt'
        })
        .option('dp', {
            alias: 'dst_protocol',
            demandOption: true,
            requiresArg: true,
            nargs: 1,
            type: 'string',
            defaultDescription: 'insert a destination protocol ',
            choices: ['mqtt', 'coap', 'http']

        })
        .option('dh', {
            alias: 'dst_host',
            //demandOption: true,
            requiresArg: true,
            nargs: 1,
            type: 'string',
            defaultDescription: 'insert a destination host '
        })
        .option('dn', {
            alias: 'dst_port_number',
            demandOption: true,
            requiresArg: true,
            nargs: 1,
            type: 'nuber',
            defaultDescription: 'insert a destination port number '
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
            if (argv.sp == 'mqtt') {

                if (!argv.st) {
                    throw new Error(" you must specify a topic if you use mqtt ")
                }
            }
            if (Number.isNaN(argv.min) || Number.isNaN(argv.max)) {
                throw new Error("min or max option not valid")
            }

            if (argv.sp == argv.dp) {
                throw new Error(" the source protocol and destination protocol must be different ")
            }

            return true
        })
}

exports.handler = function (argv) {
    let bridge = new bridge_module.bridge(argv.sh, argv.sn, argv.st, argv.dh, argv.dn,
        argv.min, argv.max)
    if (((argv.sp) == 'mqtt') && ((argv.dp) == 'coap')) {
        bridge.mqtt_to_coap()
    }
    else if (((argv.sp) == 'coap') && ((argv.dp) == 'mqtt')) {
        bridge.coap_to_mqtt()
    }
    else if (((argv.sp) == 'http') && ((argv.dp) == 'coap')) {
        bridge.http_to_coap()
    }

    else if (((argv.sp) == 'coap') && ((argv.dp) == 'http')) {
        bridge.coap_to_http()
    }

    else if (((argv.sp) == 'http') && ((argv.dp) == 'mqtt')) {
        bridge.http_to_mqtt()
    }

    else {
        bridge.mqtt_to_http()
    }

}