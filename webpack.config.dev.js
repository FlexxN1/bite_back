const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();


module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            "@components": path.resolve(__dirname, "src/components/"),
            "@pages": path.resolve(__dirname, "src/pages/"),
            "@context": path.resolve(__dirname, "src/context/"),
            "@style": path.resolve(__dirname, "src/style/"),
            "@Hooks": path.resolve(__dirname, "src/Hooks/"),
            "@routes": path.resolve(__dirname, "src/routes/"),
            "@assets": path.resolve(__dirname, "src/assets/"),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|jp(e*)g|svg|jpg|gif)$/,
                type: 'asset'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new webpack.DefinePlugin({
            "process.env.REACT_APP_API_URL": JSON.stringify(process.env.REACT_APP_API_URL || "http://localhost:3000"),
            "process.env.REACT_APP_CLOUDINARY_CLOUD_NAME": JSON.stringify(process.env.REACT_APP_CLOUDINARY_CLOUD_NAME),
            "process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET": JSON.stringify(process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET),
            "process.env.REACT_APP_PAYPAL_CLIENT_ID": JSON.stringify(process.env.REACT_APP_PAYPAL_CLIENT_ID),
        })
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname, "public"),
        },
        historyApiFallback: true,
        hot: true, // 👈 Hot Module Replacement
        open: true,
        compress: true,
        port: 3000,
        watchFiles: ["src/**/*", "public/**/*"],
    },
}