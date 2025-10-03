// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/** @type {import('webpack').Configuration} */
module.exports = (env, argv) => {
    const isDev = argv.mode === "development";

    return {
        entry: "./src/index.ts",
        output: {
            filename: isDev ? "bundle.js" : "bundle.[contenthash].js",
            path: path.resolve(__dirname, "dist"),
            clean: true,
            publicPath: "/WebGLFilters/"
        },
        devtool: isDev ? "inline-source-map" : "source-map",
        resolve: {
            extensions: [".ts", ".tsx", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"] // remove if you don't use CSS
                },
                {
                    test: /\.(png|jpe?g|gif|svg|webp)$/i,
                    type: "asset/resource" // allows `import img from './img.png'`
                },
                {
                    test: /\.(glsl|wgsl|vert|frag|json|hex|txt|ase)$/i,
                    type: "asset/source"   // gives you the file content as a string
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "public/index.html",
                inject: "body"
            })
        ],
        devServer: {
            static: path.join(__dirname, "dist"),
            port: 5173,
            open: true,
            hot: true,
            historyApiFallback: true
        },
        mode: isDev ? "development" : "production"
    };
};
