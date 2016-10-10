var path = require("path");
var webpack = require('webpack');
module.exports = {

    plugins: [
        new webpack.ProvidePlugin({
            moment: "moment"
        })],
    /*entry — name of the top level file or 
     set of files that we want to include
     in our build, can be a single file
     or an array of files. In our build,
     we only pass in our main file (app.js)
     */
    entry: ["./src/js/index.js"],
    /*output — an object containing your output 
     configuration. In our build, we only
     specify the filename key (bundle.js)
     for the name of the file we want
     Webpack to build.
     */
    output: {
        path: path.join(__dirname, "/src/bundle"),
        filename: "bundle.js",
    },
    /*
     相当于"webpack --watch-poll"，用于解决虚拟机下inotify无法传递
     而导致无法监听的问题
     */
    watchOptions: {
        poll: true
    },
    /*
     相当于"webpack --watch", 监听资源状态。
     */
    watch: true,
    /* 
     相当于 "--module-bind 'css=style!css'"
     */
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css",
            },
            {
                test: /\.less$/,
                loaders: ["style", "css", "less"],
            },
            {
                test: /\.html$/,
                loader: 'raw',
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loaders: ["babel-loader"],
            },
            {
                test: /\.(jpe?g|png|gif|svg|jpg)$/i,
                // inline base64url for <=1500 images
                loader: 'url-loader?limit=1500&name=img/[name].[hash].[ext]',
            },
            {
                test: /.(woff(2)?|eot|ttf)(\?[a-z0-9=\.]+)?$/,
                loader: 'url-loader?limit=100000&name=img/[name].[hash].[ext]'
            }
        ]
    }
};