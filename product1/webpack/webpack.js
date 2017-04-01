var loaders = require("./loaders");
var common = require('./common');
var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');

common.resolve.alias = {
    config: path.join(__dirname, '../src/config', 'develop.js')
}

module.exports = {
    entry: common.entry,
    output: common.output,
    resolve: common.resolve,
    target: "node",
    node: {
        __dirname: false,
        __filename: false
    },
    externals: [nodeExternals()],
    module:{
        loaders: loaders
    }
};