const HtmlWebpackPlugin = require('html-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const webpack = require('webpack')

module.exports = function (_env, argv) {
    const isProduction = argv.mode === 'production' || argv.mode === undefined
    return {
        entry: './examples',
        resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
        module: {
            rules: [
                {
                    test: /\.(hbs|yaml)$/,
                    type: 'asset/source',
                },
                {
                    test: /\.tsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    options: {
                        presets: [['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'],
                    },
                },
                {
                    test: /\.(css)$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(svg|ttf|eot|woff|woff2|jpg|jpeg|png|gif)$/,
                    loader: 'file-loader',
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('development'),
            }),
            new HtmlWebpackPlugin({ template: './public/index.html' }),
            new MonacoWebpackPlugin({ languages: ['yaml'] }),
        ],
        output: { clean: true, publicPath: isProduction ? '/input-form' : '/' },
        devServer: {
            port: 3002,
            proxy: { '/api/*': { target: 'https://localhost:4000', secure: false } },
            open: true,
            historyApiFallback: true,
            compress: true,
            https: true,
            overlay: true,
            hot: true,
        },
        devtool: 'inline-source-map',
    }
}
