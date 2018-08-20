const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('merk', {
        id_merk: {
            type: Sequelize.STRING(20),
            primaryKey: true
        },
        nama_merk: {
            type: Sequelize.STRING(40),
        },
        time: {
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false,
        underscored: false,
        freezeTableName: true,
        tableName: 'merk'
    });
}