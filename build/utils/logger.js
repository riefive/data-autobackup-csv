'use strict';

const path = require('path');
const { createLogger, format, transports } = require('winston');
const { getNodeEnv } = require('./common');
require('winston-daily-rotate-file');

const MESSAGE = Symbol.for('message');
const ROOTLOG = path.resolve(process.cwd(), 'backup', 'log');

const jsonFormatter = logEntry => {
    const base = { timestamp: new Date() };
    const json = Object.assign(base, logEntry);
    logEntry[MESSAGE] = JSON.stringify(json);
    return logEntry;
};

const Logger = createLogger({
    format: format(jsonFormatter)(),
    silent: getNodeEnv() === 'production' ? true : false,
    transports: [new transports.DailyRotateFile({
        filename: path.resolve(ROOTLOG, 'backup-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '5m'
    })]
});

module.exports = Logger;