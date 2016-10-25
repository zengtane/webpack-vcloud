'use strict';
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var ExtractTextPlugin = require('extract-text-webpack-plugin');//css单独打包引用
var CleanPlugin = require('clean-webpack-plugin')//webpack插件清除目录文件
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
// 定义函数判断是否是在当前生产环境，这个很重要，开发环境和生产环境配置上有一些区别
module.exports = {
  entry: getEntry(),
  output: {
    path: path.join(__dirname, 'script'),
    filename: "[name].js",
  },
  module: {
  	loaders: [
  	{  //css文件必要loader，解析css
			test: /\.css$/,
			loader: ExtractTextPlugin.extract('style', 'css')
		}, 
		{   //字体文件必要loader，解析
			test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			loader: 'file-loader?name=../styles/[name].[ext]'
		},
		{
			test: /\.(png|jpe?g|gif)$/,  //图片文件必要loader，解析
			loader: 'url-loader?limit=8192&name=image/[name].[ext]'
		}
  	]
  },
  plugins: [
  	new ExtractTextPlugin('../styles/[name].css',{
  		allChunks: true
  	}),
  	/*new webpack.ProvidePlugin({ //全局加载jq,这样不用在引入时var $ = require("../js/jquery-1.11.2.min.js")
		  $: 'jquery'
	 }),*/
	 new CleanPlugin (['./script','./styles']),
    
   /* new UglifyJsPlugin({ //debug模式即本地调试不压缩，线上压缩代码
      compress: {
        warnings: false
      },
      except: ['$super', '$', 'exports', 'require'] //排除关键字
    })*/
  ],
  resolve: {
    alias: {jquery: "../js/jquery-1.11.2.min.js"}//注意这里的路径是调用jquery时候的路径，
    //而不是相对应path或config文件的路径，待研究
    extensions: ['','.js']//忽略后缀名没写，譬如require('index')等同require('index.js')
  }
}

function getEntry(){
	var jsPath = path.resolve(__dirname,'entry');
	var dirs = fs.readdirSync(jsPath);
	var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(__dirname, 'entry', item);
        }
    });
    return files;
}
console.log(getEntry(),'getEntry')
