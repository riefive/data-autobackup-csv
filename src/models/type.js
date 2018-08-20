const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('type', {
        id_jenis: {
            type: Sequelize.STRING(20),
            primaryKey: true
        },
        nama_jenis: {
            type: Sequelize.STRING(30)
        },
    }, {
        timestamps: false,
        underscored: false,
        freezeTableName: true,
        tableName: 'jenis'
    });
}