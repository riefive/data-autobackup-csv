const path = require('path');
const moment = require('moment');
const { createLogger, format, transports } = require('winston');
const { getNodeEnv } = require('./common');
require('winston-daily-rotate-file');

const MESSAGE = Symbol.for('message');
const jsonFormatter = (logEntry) => {
    const date = new Date();
    const base = { timestamp: date, localtime: moment(date).format('YYYY-MM-DD HH:mm:ss') };
    const json = Object.assign(base, logEntry);
    logEntry[MESSAGE] = JSON.stringify(json);
    return logEntry;
};

class Logger {
    constructor (destination = 'backup') {
        this.log = null;
        this.destination = destination;
        this.init();
    }

    init () {
        this.pathname = path.resolve(process.cwd(), this.destination, 'log'); 
        this.log = createLogger({
            format: format(jsonFormatter)(),
            silent: getNodeEnv() === 'production' ? false : false,
            transports: [
                new transports.DailyRotateFile({
                    filename: path.resolve(this.pathname, 'backup-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '5m'
                })
            ]
        });
    }

    getLog () {
        return this.log;
    }
}

module.exports = Logger;
