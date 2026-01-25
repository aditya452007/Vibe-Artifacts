const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: {
        popup: './src/popup/index.tsx',
        background: './src/background/service-worker.ts',
        content: './src/content/content-script.ts',
        // offscreen: './src/offscreen/offscreen.ts' // If needed later
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/popup/popup.html',
            filename: 'popup.html',
            chunks: ['popup'],
        }),
        new CopyPlugin({
            patterns: [
                { from: 'src/manifest.json', to: 'manifest.json' },
                // Copy icons if they exist
                // { from: 'src/assets/icons', to: 'icons', noErrorOnMissing: true },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
    devtool: 'cheap-module-source-map', // Good for dev, change for prod
    stats: {
        errorDetails: true,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};
