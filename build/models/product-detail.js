'use strict';

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('product_detail', {
        id_barang: {
            type: Sequelize.STRING(20),
            primaryKey: true
        },
        id_toko: {
            type: Sequelize.STRING(20),
            primaryKey: true
        },
        jumlah: {
            type: Sequelize.INTEGER
        },
        harga_beli: {
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false,
        underscored: false,
        freezeTableName: true,
        tableName: 'barang_detail'
    });
};