const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('store', {
        id_toko: {
            type: Sequelize.STRING(45),
            primaryKey: true
        },
        nama_toko: {
            type: Sequelize.STRING(30)
        },
        alamat: {
            type: Sequelize.TEXT 
        }
    }, {
        timestamps: false,
        underscored: false,
        freezeTableName: true,
        tableName: 'toko'
    });
}