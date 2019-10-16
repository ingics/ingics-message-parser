#!/usr/bin/env node

const yargs = require('yargs');
const parser = require('@ingics/message-parser');

const argv = yargs
    .command('message', 'parse full message from gateway', (yargs) => {
        var argv = yargs.reset()
            .usage(`Usage: ${yargs['$0']} message <message string>`)
            .help()
            .alias('help', 'h')
            .argv;
    })
    .command('payload', 'parse BLE payload from beacon', (yargs) => {
        var argv = yargs.reset()
            .usage(`Usage: ${yargs['$0']} payload <payload string>`)
            .help()
            .alias('help', 'h')
            .argv;
    })
    .usage(`Usage: ${yargs['$0']} [command]`)
    .help()
    .alias('help', 'h')
    .argv;

switch (argv._[0]) {
case 'message':
    if (typeof argv._[1] === 'undefined') {
        console.log('Error: message string is missing\n');
        yargs.showHelp();
        process.exit(-1);
    }
    parser.parseMessage(argv._[1], (data) => {
        console.log(data);
    })
    break;
case 'payload':
    if (typeof argv._[1] === 'undefined') {
        console.log('Error: payload string is missing\n');
        yargs.showHelp();
        process.exit(-1);
    }
    console.log(parser.parsePayload(argv._[1]));
    break;
default:
    yargs.showHelp();
    process.exit(-1);
}
