const inquirer = require('inquirer');
const joi = require('joi');
const _ = require('lodash');

function validatedEmptyString (value) {
    return /\S+/.test(value) || 'Silahkan masukan teks';
}

function validNumber (value) {
    return ! isNaN(parseInt(value)) || 'Silahkan masukan angka';
}

function validatedThenGo (object, param1, param2) {
    let isprop1 = object.hasOwnProperty(param1);
    let isprop2 = object.hasOwnProperty(param2);
    let valid1 = isprop1 && object[param1] === true;
    let valid2 = isprop2 && object[param2] !== null && object[param2].trim() !== '';
    return valid1 && valid2;
}

class Questions {
    constructor (config) {
        this.config = config;
    }

    update (config) {
        this.config = config;
    }

    main () {
        return [
            {
                type: 'list',
                name: 'menu',
                message: 'Pilih perintah konfigurasi dibawah ini.',
                choices: ['database', 'folder', 'limit', 'interval', 'start', new inquirer.Separator(), 'exit']
            }
        ];
    }

    database () {
        let hostnameValue = 'localhost';
        let databaseValue = 'data';
        let usernameValue = 'root';
        let passwordValue = '';

        if (_.has(this.config, 'data')) {
            hostnameValue = _.has(this.config.data, 'host') ? this.config.data.host : hostnameValue;
            databaseValue = _.has(this.config.data, 'database') ? this.config.data.database : databaseValue;
            usernameValue = _.has(this.config.data, 'username') ? this.config.data.username : usernameValue;
            passwordValue = _.has(this.config.data, 'password') ? this.config.data.password : passwordValue;
        }
        
        return [
            {
                type: 'confirm',
                name: 'isdatabase',
                message: 'Ingin mengatur kembali konfigurasi database?',
                default: false
            },
            {
                type: 'input',
                name: 'host',
                message: 'Lokasi host database Anda?',
                default: hostnameValue,
                validate: function (value) {
                    return validatedEmptyString(value);
                }, 
                when: function (answers) {
                    return answers.isdatabase === true;
                }
            },
            {
                type: 'input',
                name: 'database',
                message: 'Nama database Anda?',
                default: databaseValue,
                validate: function (value) {
                    return validatedEmptyString(value);
                },
                when: function (answers) {
                    return validatedThenGo(answers, 'isdatabase', 'host');
                }
            },
            {
                type: 'input',
                name: 'username',
                message: 'Nama user database Anda?',
                default: usernameValue,
                validate: function (value) {
                    return validatedEmptyString(value);
                },
                when: function (answers) {
                    return validatedThenGo(answers, 'isdatabase', 'database');
                }
            },
            {
                type: 'password',
                name: 'password',
                message: 'Kata sandi database Anda?',
                default: passwordValue,
                mask: '*',
                validate: function (value) {
                    return validatedEmptyString(value);
                },
                when: function (answers) {
                    return validatedThenGo(answers, 'isdatabase', 'username');
                }
            }
        ];
    }

    folder () {
        let folderValue = _.has(this.config, 'folder') ? this.config.folder : 'backup';

        return [
            {
                type: 'confirm',
                name: 'isfolder',
                message: 'Ingin mengatur kembali konfigurasi nama folder pemyimpanan?',
                default: false
            },
            {
                type: 'input',
                name: 'folder',
                message: 'Nama lokasi folder penyimpanan?',
                default: folderValue,
                filter: function (value) {
                    return value.toLowerCase();
                },
                validate: function (value) {
                    let schema = joi.string().alphanum().min(3).max(30).required();
                    let valid = joi.validate(value, schema);
                    return (valid.error === null) || valid.error;
                },
                when: function (answers) {
                    return answers.isfolder === true;
                }
            }
        ];
    }

    limit () {
        let limitValue = _.has(this.config, 'limit') ? this.config.limit : '10000';

        return [
            {
                type: 'confirm',
                name: 'islimit',
                message: 'Ingin mengatur kembali konfigurasi limit?',
                default: false
            },
            {
                type: 'list',
                name: 'limit',
                message: 'Jumlah data maksimal yang diambil?',
                choices: ['10', '15', '25', '50', '100', '250', '500', '1000', '5000', '10000', '100000'],
                default: limitValue,
                validate: function (value) {
                    return validNumber(value);
                },
                when: function (answers) {
                    return answers.islimit === true;
                }
            }
        ];
    }

    interval () {
        return [
            {
                type: 'confirm',
                name: 'isinterval',
                message: 'Ingin mengulangi pengaturan konfigurasi interval?',
                default: false
            },
            {
                type: 'list',
                name: 'interval',
                message: 'Berapa lama waktu timer interval?',
                choices: ['1menit', '5menit', '15menit', '30menit', '1jam', '3jam', '5jam', '12jam'],
                filter: function (value) {
                    return value.toLowerCase();
                },
                when: function (answers) {
                    return answers.isinterval === true;
                }
            }
        ];
    }
}

module.exports = Questions;