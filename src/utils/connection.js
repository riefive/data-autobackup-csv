const Sequelize = require('sequelize');

const Connection = (options) => {
    if (options === null) {
        throw new Error('Option can\`t be null');
    }

    let database = options.hasOwnProperty('database') ? options.database : '';
    let username = options.hasOwnProperty('username') ? options.username : '';
    let password = options.hasOwnProperty('password') ? options.password : '';
    let hostname = options.hasOwnProperty('hostname') ? options.hostname : '';
    let dbengine = options.hasOwnProperty('engine') ? options.engine : 'mysql';

    return new Sequelize(database, username, password, {
        host: hostname,
        dialect: dbengine,
        operatorsAliases: false,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
}

module.exports = Connection;
