const CracoAntDesignPlugin = require('craco-antd');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
module.exports = {
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {},
        },
    ], devServer: {
        proxy: {
            '/sso': {
                target: 'https://analyzer.imfil.io',
                changeOrigin: true,
            },
            '/api': {
                target: 'https://analyzer.imfil.io',
                changeOrigin: true,
            }
        },
    },
    webpack: {
        plugins: [
            // 查看打包的进度
            new SimpleProgressWebpackPlugin(),
        ],
    },
};
