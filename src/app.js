const path = require('path');
const inquirer = require('inquirer');
const _ = require('lodash');
const CategoryModel = require('./models/category');
const MerkModel = require('./models/merk');
const TypeModel = require('./models/type');
const StoreModel = require('./models/store');
const ProductModel = require('./models/product');
const ProductDetailModel = require( './models/product-detail');
const ProductAsk = require('./tasks/product-ask');
const ExportAsk = require('./tasks/export-ask');
const Connection = require('./utils/connection');
const FileConfig = require('./utils/fileconfig');
const FileDirectory = require('./utils/filedirectory');
const Questions = require('./utils/questions');
const Timer = require('./utils/timer');
const Commons = require('./utils/common');
const Logger = require('./utils/logger');

const source = path.resolve(process.cwd(), 'config.dfg');
const fc = new FileConfig(source);
const fd = new FileDirectory();
let config = fc.read(true);
let quest = new Questions(config);
let folder = _.has(config, 'folder') ? config.folder : 'backup';
const logcmd = new Logger(folder);
const logger = logcmd.getLog();
const tm = new Timer(logger);
fd.setpath(folder);

const init = async () => {
  try {
    const conn = Connection({
      hostname: config.data.host,
      username: config.data.username,
      password: config.data.password,
      database: config.data.database,
      engine: config.data.engine
    });

    await conn.sync({force: false});

    const Category = CategoryModel(conn);
    const Merk = MerkModel(conn);
    const Type = TypeModel(conn);
    const Product = ProductModel(conn);
    const ProductDetail = ProductDetailModel(conn);
    const Store = StoreModel(conn);

    ProductDetail.belongsTo(Product, { foreignKey: 'id_barang' });
    ProductDetail.belongsTo(Store, { foreignKey: 'id_toko' });
    Product.belongsTo(Category, { foreignKey: 'id_category' });
    Product.belongsTo(Merk, { foreignKey: 'id_merk' });
    Product.hasMany(ProductDetail, { foreignKey: 'id_barang', as: 'details' });
    Store.hasOne(ProductDetail, { foreignKey: 'id_toko', as: 'store' }); 
    Category.belongsTo(Type, { foreignKey: 'id_jenis' }); 
    Category.hasOne(Product, { foreignKey: 'id_category', as: 'category' }); 
    Merk.hasOne(Product, { foreignKey: 'id_merk', as: 'merk' });
    Type.hasOne(Category, { foreignKey: 'id_jenis', as: 'type' });
    
    async function downloadProduct (limit = 5) {
      limit = isNaN(parseInt(limit)) ? 100 : parseInt(limit); 
      const productlists = await ProductAsk.getAll({ 
        Category, Merk, Type, Store, Product, ProductDetail 
      }, limit);

      let out = ExportAsk.getProduct(productlists);
      fd.writefile('product', out.csv);
      logger.info('Menyimpan produk dalam format csv');
    }

    tm.main(downloadProduct, [config.limit], config.interval);
  } catch (err) {
    let out = Commons.jsonToArray(err);
    if (_.has(out, 'parent.syscall')) logger.warn(`${out.parent.code}: ${out.parent.syscall}`);
    if (_.has(out, 'parent.sqlMessage')) logger.warn(`${out.parent.code}: ${out.parent.sqlMessage}`);
    logger.warn(JSON.stringify(out, null, 4));
  }
};

const exit = () => {
  tm.clear();
  setTimeout(() => {
    process.exit(1);
  }, 1000);
};

const start = () => {
  config = fc.read(true);
  if (! config.hasOwnProperty('data')) {
    menu('database');
  }

  fd.start();
  init();
};

const menu = async (key = null) => {
  config = fc.read(true);
  quest.update(config);
  let publickey = config.publickey;
  let secondkey = config.secondkey;
  let revpubkey = publickey.split('').reverse().join('');
  let revseckey = secondkey.split('').reverse().join('');
  let rwdata = null;
  let nwdata = null;
  let nwconfig = null;

  if (key === null) {
    let ask = await inquirer.prompt(quest.main());
    key = ask !== null && ask.hasOwnProperty('menu') ? ask.menu : 'exit';
  }

  switch (key) {
    case 'database': {
      rwdata = await inquirer.prompt(quest.database()); 

      if (rwdata.isdatabase) {
        nwdata = {
          host: rwdata.host,
          database: rwdata.database,
          username: rwdata.username,
          password: rwdata.password,
          engine: 'mysql',
        };
  
        nwconfig = fc.read();
        fc.save(nwconfig, { data: fc.encodechild(nwdata, publickey, secondkey) });
      }

      menu();
      break;
    }
    case 'folder': {
      rwdata = await inquirer.prompt(quest.folder()); 

      if (rwdata.isfolder) {
        nwconfig = fc.read();
        fc.save(nwconfig, { folder: rwdata.folder });
      }

      menu();
      break;
    }
    case 'limit': {
      rwdata = await inquirer.prompt(quest.limit()); 

      if (rwdata.islimit) {
        nwconfig = fc.read();
        fc.save(nwconfig, { limit: rwdata.limit });
      }

      menu();
      break;
    }
    case 'interval': {
      rwdata = await inquirer.prompt(quest.interval()); 

      if (rwdata.isinterval) {
        let num = 0;
        switch (rwdata.interval) {
          case '1menit': num = 1 * 60; break;
          case '5menit': num = 5 * 60; break;
          case '15menit': num = 15 * 60; break;
          case '30menit': num = 30 * 60; break;
          case '1jam': num = 1 * 60 * 60; break;
          case '3jam': num = 3 * 60 * 60; break;
          case '5jam': num = 5 * 60 * 60; break;
          case '12jam': num = 12 * 60 * 60; break;
          default: num = 5; break;
        }

        nwconfig = fc.read();
        fc.save(nwconfig, { interval: String(num) });
      }

      menu();
      break;
    }
    case 'exit': {
      exit(); 
      break;
    }
    default: {
      logger.info('Menjalankan perintah backup');
      start();
      break;
    }
  }
};

process.on('SIGTERM', exit); // close connections on hot code push
process.on('SIGINT', exit); // close connections on exit (ctrl + c)
process.on('unhandledRejection', err => {
  logger.warn('unhandled-rejection');
  ! _.isEmpty(err) ? logger.warn(JSON.stringify(err, null, 4)) : logger.warn(err);
});

menu();