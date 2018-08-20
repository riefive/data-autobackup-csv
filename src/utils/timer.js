const NanoTimer = require('nanotimer');

class Timer {
    constructor (logger = null) {
        this.timer = new NanoTimer();
        this.log = logger;
    }

    main (routines, params, interval = 10) {
        this.log.info('interval is start');
        this.timer.setInterval(routines, params, `${interval}s`);
    }

    mainOut (routines, params, interval = 10) {
        let self = this;
        this.log.info('timeout is start');
        this.timer.setTimeout(routines, params, `${interval}s`, (t) => {
            let nTime = t.waitTime / Math.pow(10, 9);
            self.logger.info(`elapsed time ${nTime}`);
            self.mainOut(routines, params, `${interval}s`);
        });
    }

    clear () {
        this.log.info('interval is stop');
        this.timer.clearInterval();
    }

    clearOut () {
        this.log.info('interval is start');
        this.timer.clearTimeout();
    }
}

module.exports = Timer;