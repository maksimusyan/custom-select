const path = require('path');
module.exports = {
    entry: './src/js/custom_select.js',
    output: {
        path: path.resolve(__dirname, './build'),
        publicPath: '/build/',
        filename: 'custom_select.min.js'
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "sass-loader" // compiles Sass to CSS
            }]
        }]
    }
};