"use strict";

async function getCategory(Model, id) {
    try {
        return await Model.findOne({
            where: {
                id_category: id
            }
        });
    } catch (err) {
        throw err;
    }
}

async function getMerk(Model, id) {
    try {
        return await Model.findOne({
            where: {
                id_merk: id
            }
        });
    } catch (err) {
        throw err;
    }
}

async function getType(Model, id) {
    try {
        return await Model.findOne({
            where: {
                id_jenis: id
            }
        });
    } catch (err) {
        throw err;
    }
}

async function getStore(Model, id) {
    try {
        return await Model.findOne({
            where: {
                id_toko: id
            }
        });
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getCategory, getMerk, getType, getStore
};