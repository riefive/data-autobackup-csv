const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

let env = 'production';
if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
    env = 'development';
}

module.exports = {
    entry: './build/app.js',
    target: 'node',
    devtool: env !== 'development' ? false : 'eval-source-map',
    mode: env,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: 'dist/'
    },
    node: {
        fs: 'empty',
        __dirname: false,
        __filename: true,
    },
    externals: [ nodeExternals() ],
    module: {
        rules: [
            {
                use: 'babel-loader',
                exclude: /(node_modules)/,
                test: /\.js$/
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    ecma: 6,
                    beautify: false,
                    compress: true,
                    comments: false,
                    minify: true,
                    mangle: true,
                    toplevel: false,
                    keep_classnames: false,
                    keep_fnames: false,
                    output: {
                        comments: false
                    }
                }
            }),
        ]
    }
}
