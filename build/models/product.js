'use strict';

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('product', {
        id_barang: {
            type: Sequelize.STRING(30),
            primaryKey: true
        },
        id_merk: {
            type: Sequelize.STRING(20)
        },
        id_category: {
            type: Sequelize.STRING(20)
        },
        nama_barang: {
            type: Sequelize.STRING(50)
        },
        harga_jual: {
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false,
        underscored: false,
        freezeTableName: true,
        tableName: 'barang'
    });
};