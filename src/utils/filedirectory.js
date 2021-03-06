const fs = require('fs');
const path = require('path');
const util = require('util');
const moment = require('moment');
const Promise = require('bluebird');
const fsblue = Promise.promisifyAll(fs);

class FileDirectory {
    constructor (pathname = 'backup') {
        this.pathname = pathname;
        this.init();
    }

    setpath (name) {
        this.pathname = path.resolve(process.cwd(), name);
    }

    getpath (name) {
        return Array.isArray(name) ? 
            path.resolve.apply(null, [...new Set([this.pathname, ...name])]) : 
            path.resolve(this.pathname, name);
    }

    getsubpath (name) {
        let month = moment().format('MM');
        let datestring = moment().format('DD-MM-YYYY');
        let nwname = [...new Set([ ...this.childfolder[parseInt(month)-1], `${name}-${datestring}.csv`]) ];
        return nwname;
    }

    makefolder (name) {
        let folder = this.getpath(name);
        if (! fsblue.existsSync(folder)) {
            return fsblue.mkdirAsync(folder);
        }
    }

    writefile (name, txt) {
        return fsblue.writeFileAsync(this.getpath(this.getsubpath(name)), txt);    
    }

    init () {
        let thisYear = moment().format('YYYY');
        this.subfolder = `file-${thisYear}`;
        this.childfolder = [];

        for (let i = 1; i <= 12; i++) {
            let monthValue = String(i).padStart(2, '0');
            let theDate = util.format('%s-%s-%s', thisYear, monthValue, '01');
            let theMonth = moment(theDate).format('MMM');
            this.childfolder.push([this.subfolder, `${monthValue}-${theMonth.toLowerCase()}`]);
        }
    }

    start () {
        if (! fs.existsSync(this.pathname)) {
            fsblue.mkdirAsync(this.pathname);
        }

        setTimeout(() => {
            this.makefolder(this.subfolder);
        }, 100);

        setTimeout(() => {
            for (let i = 0; i < this.childfolder.length; i++) {
                const element = this.childfolder[i];
                this.makefolder(element);
            }
        }, 500);
    }
}

module.exports = FileDirectory;