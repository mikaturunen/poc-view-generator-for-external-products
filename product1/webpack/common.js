const path = require("path");

module.exports.entry = "./src/app.ts";

module.exports.output = {
    path: path.join(__dirname, '/../build'),
    filename: "app.js",
    libraryTarget: "commonjs"
}
module.exports.resolve = {
    modules: [
        "node_modules",
        path.resolve(__dirname, "node_modules"),
        path.resolve(__dirname, "src"),
        path.resolve(__dirname, "../src")
    ],
    extensions: [ ".ts", ".js" ]
}