# Stock Auto Backup
Bundling App with babel, webpack & pkg.

## Description
### Set PATH
- PATH=$(npm bin):$PATH => linux
- SET PATH=node_modules\\.bin;%PATH% => windows
### Install Global Npm:
- npm install -g pkg - make exec
### Install Development Npm:
- npm install --save-dev rimraf => remove file or folder
- npm install --save-dev npm-run-all => run multiple npm scripts
- npm install --save-dev babel-cli => tranpile js 
- npm install --save-dev babel-core
- npm install --save-dev babel-loader
- npm install --save-dev babel-preset-env
- npm install --save-dev webpack => bundling nodejs app
- npm install --save-dev webpack-cli
- npm install --save-dev uglifyjs-webpack-plugin
- npm install --save-dev webpack-node-externals
- npm install --save-dev cross-env

## Running
- **npm start** => running all commands
- **npm run main:src** => running node src/app.js
- **npm run main:build** => running build/app.js
- **npm run main:dist** => running node dist/app.js

## Use the Project
- git clone https://github.com/riefive/data-autobackup-csv.git [target-name]
- cd [target-name]
- npm install
- npm start
