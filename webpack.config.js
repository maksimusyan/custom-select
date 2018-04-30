const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    mode: "production", // Режим работы Webpack. Доступно: "production" | "development" | "none"
    entry: ['./src/js/custom_select.js','./src/scss/custom_select.scss'],
    output: {
        // Целевой каталог для всех выходных файлов
        // должен быть абсолютным путем (используйте модуль пути Node.js)
        path: path.resolve(__dirname, './build'),
        // URL-адрес выходного каталога, относительно HTML-страницы
        publicPath: '/build/',
        // Имя итогового файла
        filename: 'custom_select.min.js'
    },
    module: {
        rules: [
            {
                // Компиляция sass/scss в css
                test: /\.(css|sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                js: {
                    test: /\.js$/,
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 7,
                },
                css: {
                    test: /\.(css|sass|scss)$/,
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2,
                }
            }
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'custom_select.css',
        }),
    ]
};