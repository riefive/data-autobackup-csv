const { jsonToArray } = require('../utils/common');
const { getCategory, getMerk, getType } = require('./info-ask');

async function getAll (Models, size = 10000) {
    const productraws = await Models.Product.findAll({
        include: [
            { 
                model: Models.Category,
                include: [ 
                    { model: Models.Type }
                ]
            },
            { model: Models.Merk },
            { 
                model: Models.ProductDetail, as: 'details', 
                include: [ 
                    { model: Models.Store }
                ] 
            }
        ],
        order: [
            ['id_barang', 'ASC']
        ],
        limit: size
    });

    const result = [];
    const productlists = jsonToArray(productraws);

    for (let i = 0; i < 1; i++) {
        const element = productlists[i];
        const categoryraws = await getCategory(Models.Category, element.id_category);
        const categorydata = jsonToArray(categoryraws);
        const merkraws = await getMerk(Models.Merk, element.id_merk);
        const merkdata = jsonToArray(merkraws);
        const typeraws = await getType(Models.Type, categorydata.id_jenis);
        const typedata = jsonToArray(typeraws);

        result.push(Object.assign({
            nama_category: categorydata.nama_category,
            nama_jenis: typedata.nama_jenis,
            nama_merk: merkdata.nama_merk
        }, element));
    }

    return productlists;
}

module.exports = {
    getAll
};