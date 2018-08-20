'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');
const faker = require('faker');
const Crypted = require('./crypted');
const { getNodeEnv } = require('./common');

class FileConfig {
    constructor(source) {
        this.source = source;
        this.crypt = new Crypted();
    }

    initchild(publickey, secondkey) {
        if (getNodeEnv() === 'production') {
            publickey = publickey.split('').reverse().join('');
            secondkey = secondkey.split('').reverse().join('');
        }
        return {
            public: publickey,
            second: secondkey
        };
    }

    encodechild(source, publickey, secondkey) {
        let key = this.initchild(publickey, secondkey);
        let nwdata = source;
        if (nwdata.hasOwnProperty('username')) {
            nwdata.username = this.crypt.encodesync(nwdata.username, key.second);
        }
        if (nwdata.hasOwnProperty('password')) {
            nwdata.password = this.crypt.encodesync(nwdata.password, key.second);
        }

        return jwt.sign(nwdata, key.public);
    }

    decodechild(source, publickey, secondkey) {
        let key = this.initchild(publickey, secondkey);
        let nwdata = jwt.verify(source, key.public);
        if (nwdata.hasOwnProperty('username')) {
            nwdata.username = this.crypt.decodesync(nwdata.username, key.second);
        }
        if (nwdata.hasOwnProperty('password')) {
            nwdata.password = this.crypt.decodesync(nwdata.password, key.second);
        }

        return nwdata;
    }

    read(iscrypt = false) {
        let result = null;

        if (fs.existsSync(this.source) && fs.statSync(this.source).isFile()) {
            const rwcfg = fs.readFileSync(this.source, 'utf8');
            result = JSON.parse(rwcfg.toString());
            let publickey = result.hasOwnProperty('publickey') ? result.publickey : '';
            let secondkey = result.hasOwnProperty('secondkey') ? result.secondkey : '';

            if (iscrypt && result.hasOwnProperty('data')) {
                let nwdata = this.decodechild(result.data, publickey, secondkey);
                result.data = nwdata;
            }
        } else {
            const randomkey1 = faker.finance.bitcoinAddress();
            const randomkey2 = faker.finance.iban();

            result = {
                limit: '10',
                interval: '60',
                publickey: randomkey1,
                secondkey: randomkey2
            };

            try {
                fs.writeFileSync(this.source, JSON.stringify(result, null, 4), 'utf8');
            } catch (err) {
                throw JSON.stringify(err, null, 4);
            }
        }

        return result;
    }

    save(basic, extended) {
        let nwsetting = Object.assign(basic, extended);
        try {
            fs.writeFileSync(this.source, JSON.stringify(nwsetting, null, 4), 'utf8');
        } catch (err) {
            throw JSON.stringify(err, null, 4);
        }
    }
}

module.exports = FileConfig;