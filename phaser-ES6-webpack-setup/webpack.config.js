const path = require('path'); // deals with absolute paths.
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        // A single file that starts the game.
        app: './src/index.js',
    },

    output: {
        // The bundled output destination.
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[chunkhash].bundle.js'
    },

    optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 0
        }
    },

    // Now, tell webpack to run the babel-loader through the source code
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },

    plugins: [
        // This plugin will copy the index.html from the root to the build folder.
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'assets', '**', '*'),
                to: path.resolve(__dirname, 'build')
            }
        ]),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html'
        }),

        // defines the Phaser renderer, in this case: Canvas.
        new webpack.DefinePlugin({
            'typeof CANVAS_RENDERER': JSON.stringify(true),
            'typeof WEBGL_RENDERER': JSON.stringify(false),
        }),

    ],

    // Webpack Dev Server that will be live reloading the page when changes are done.
    devServer: {
        contentBase: path.resolve(__dirname, 'build')
    }
};
