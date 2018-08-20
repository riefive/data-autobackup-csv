'use strict';

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('category', {
        id_category: {
            type: Sequelize.STRING(20),
            primaryKey: true
        },
        nama_category: {
            type: Sequelize.STRING(30)
        },
        id_jenis: {
            type: Sequelize.STRING(20)
        }
    }, {
        timestamps: false,
        underscored: false,
        freezeTableName: true,
        tableName: 'category'
    });
};