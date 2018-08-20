'use strict';

const NanoTimer = require('nanotimer');
let timer = new NanoTimer();

function main(routines, params, interval = 10) {
    timer.setInterval(routines, params, `${interval}s`);
}

function mainsecond(routines, params, interval = 10) {
    timer.setTimeout(routines, params, `${interval}s`, t => {
        let nTime = t.waitTime / Math.pow(10, 9);
        Logger.info(`elapsed time ${nTime}`);
        mainsecond(routines, params, `${interval}s`);
    });
}

function clear() {
    timer.clearInterval();
}

function clearsecond() {
    timer.clearTimeout();
}

module.exports = {
    timer, main, mainsecond, clear, clearsecond
};