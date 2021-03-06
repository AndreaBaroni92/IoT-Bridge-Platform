const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
yargs(hideBin(process.argv))
    .command(require('./cmd/visualize'))
    .command(require('./cmd/saveCmd'))
    .command(require('./cmd/translate'))
    .help()
    .demandCommand(1)
    .strict(true)
    .argv