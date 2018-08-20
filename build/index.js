'use strict';

const fs = require('fs');
const path = require('path');
const main = path.dirname(__dirname);
const source = path.resolve(main, 'package.json');
const target = path.resolve(main, 'dist', 'package.json');

try {
    if (fs.existsSync(source) && fs.statSync(source).isFile()) {
        const packages = fs.readFileSync(source, 'utf8');
        const data = JSON.parse(packages.toString());
        delete data.scripts;
        delete data.devDependencies;
        if (data.hasOwnProperty('pkg')) delete data.pkg;
        fs.writeFileSync(target, JSON.stringify(data, null, 4));
    }
} catch (error) {
    throw error;
}