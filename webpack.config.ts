/* eslint-disable i18next/no-literal-string */
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'
import ReactRefreshTypeScript from 'react-refresh-typescript'
import webpack from 'webpack'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'
// import { ConsoleRemotePlugin } from '@openshift-console/dynamic-plugin-sdk-webpack'

module.exports = function (_env: unknown, argv: { hot: boolean; mode: string | undefined }) {
    const isProduction = argv.mode === 'production' || argv.mode === undefined
    const isDevelopment = !isProduction

    const config: webpack.Configuration & { devServer: DevServerConfiguration } = {
        entry: './examples',
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            alias: { handlebars: 'handlebars/dist/handlebars.js' },
        },
        module: {
            rules: [
                { test: /\.(hbs|yaml)$/, type: 'asset/source' },
                { test: /\.(svg)$/, use: '@svgr/webpack' },
                { test: /\.(jpg|jpeg|png|gif|ttf|eot|woff|woff2)$/, type: 'asset/resource' },
                {
                    test: /\.css$/,
                    use: isDevelopment ? ['style-loader', 'css-loader'] : [MiniCssExtractPlugin.loader, 'css-loader'],
                },
                {
                    test: /\.(ts|tsx|js|jsx)$/,
                    exclude: /node_modules/,
                    loader: 'ts-loader',
                    options: {
                        configFile: isDevelopment ? 'tsconfig.dev.json' : 'tsconfig.json',
                        transpileOnly: true,
                        getCustomTransformers: () => ({
                            before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
                        }),
                    },
                    type: 'javascript/auto',
                },
            ],
        },
        plugins: [
            // new ConsoleRemotePlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('development'),
                'process.env.REACT_APP_BACKEND_HOST': isProduction,
            }),
            new MonacoWebpackPlugin({ languages: ['yaml'] }),
            isProduction && new CompressionPlugin({ algorithm: 'gzip' }),
            isDevelopment && new ReactRefreshWebpackPlugin(),
            new HtmlWebpackPlugin({ title: 'Form Wizard', favicon: 'public/favicon.min.svg' }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash:8].css',
                chunkFilename: '[id].[contenthash:8].css',
                ignoreOrder: false, // Enable to remove warnings about conflicting order
            }),
        ].filter(Boolean) as webpack.WebpackPluginInstance[],
        // output: {
        //     assetModuleFilename: 'assets/[name].[contenthash:8][ext][query]',
        //     filename: '[name].[contenthash:8].js',
        //     chunkFilename: '[name].[contenthash:8].js',
        //     publicPath: isProduction ? '/' : '/',
        //     clean: true,
        // },
        optimization: {
            minimizer: [
                `...`,
                new CssMinimizerPlugin({
                    minimizerOptions: {
                        preset: ['default', { mergeLonghand: false }],
                    },
                }),
            ],
        },
        devServer: {
            port: 3000,
            open: true,
            // historyApiFallback: true,
            compress: true,
            // https: true,
            hot: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            },
            client: {
                overlay: false,
            },
        },
        // devtool: isDevelopment && 'eval-cheap-module-source-map',
    }

    return config
}
