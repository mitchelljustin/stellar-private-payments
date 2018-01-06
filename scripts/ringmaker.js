"use strict";

let program = require('commander')

const RingMaker = require('../lib/ringmaker')
program
    .option('--stdout', 'Print to stdout')
    .option('-r, --ringsize [number]', 'Ring size')
    .option('-p, --pmtsize [number]', 'Payment size')
    .parse(process.argv)


let options = {
    redis: require('../lib/redis'),
    pmtSize: parseInt(program.pmtsize),
    ringSize: parseInt(program.ringsize),
    stdout: program.stdout,
}
new RingMaker(options).runForever()