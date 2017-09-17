const path = require( "path" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const CleanWebpackPlugin = require( "clean-webpack-plugin" );
const webPackTemplate = require( "html-webpack-template" );

module.exports = {
    context: path.resolve( __dirname, "src" ),

    entry: {
        chunclockclock: "./index.js",
    },

    plugins: [
        new CleanWebpackPlugin( [ "dist" ] ),
        new HtmlWebpackPlugin( {
            inject: false,
            template: webPackTemplate,
            mobile: true,
            lang: "en-US",
            appMountId: "chunclockclock",
        } ),
    ],

    output: {
        filename: "[name].[chunkhash].js",
        path: path.resolve( __dirname, "dist" ),
    },

};
