'use strict';

const Papa = require('papaparse');

function getProduct(lists) {
    let result = [];
    const columns = ['Id barang', 'Nama Merk', 'Nama Kategori', 'Jenis', 'Nama Barang', 'Id Toko', 'Nama Toko', 'Harga Jual', 'Harga Beli', 'Jumlah'];

    for (let i = 0; i < lists.length; i++) {
        const element = lists[i];
        let target = {
            id_barang: element.id_barang,
            nama_merk: element.hasOwnProperty('merk') ? element.merk.nama_merk : '',
            nama_kategori: element.hasOwnProperty('category') ? element.category.nama_category : '',
            jenis: element.hasOwnProperty('category') ? element.category.type.nama_jenis : '',
            nama_barang: element.nama_barang,
            id_toko: null,
            nama_toko: null,
            harga_jual: element.harga_jual,
            harga_beli: 0,
            jumlah: 0
        };

        if (element.details.length > 0) {
            for (const detail of element.details) {
                let subtarget = {
                    id_barang: detail.id_barang,
                    id_toko: detail.id_toko,
                    nama_toko: detail.store.nama_toko,
                    harga_beli: detail.harga_beli,
                    jumlah: detail.jumlah
                };

                target = Object.assign({}, target, subtarget);
                result.push(Object.values(target));
            }
        } else {
            result.push(Object.values(target));
        }
    }

    return {
        raw: result,
        cols: columns,
        csv: Papa.unparse({ fields: columns, data: result })
    };
}

module.exports = {
    getProduct
};