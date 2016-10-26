'use strict';
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var ExtractTextPlugin = require('extract-text-webpack-plugin');//css单独打包引用
var CleanPlugin = require('clean-webpack-plugin')//webpack插件清除目录文件
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
//提取公共模块例如jquery等公共插件，不用都打包进目标文件
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
//文件复制插件
var CopyWebpackPlugin = require('copy-webpack-plugin');
//自动补全css3前缀
var Autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const debug = process.env.NODE_EVN !== "production"
//构建之后为public目录
var chunks = Object.keys(getEntry());
module.exports = {
  entry: getEntry(),
  output: {
    path: path.join(__dirname, 'public'),
    filename: "script/[name].js",
  },
  module: {
  	loaders: [
    	{  //css文件必要loader,postcss必须和css-loader放在一起
  			test: /\.css$/,
  			loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
  		}, 
       /*{
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!less-loader")
      },*/
  		{   //字体文件必要loader
  			test: /\.(woff|woff2|ttf|eot|svg)$/,
  			loader: 'file-loader?name=styles/[name].[ext]'
  		},
      {
          //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
          //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
          test: /\.html$/,
          loader: "html?attrs=img:src img:data-src"
      }, 
       {
        test: /\.(png|jpg|gif)$/,//只对background-image设置的图片
        loader: 'url-loader?name=image/[name].[ext]'
      },
      
  	]
  },
  plugins: [
  	new ExtractTextPlugin('styles/[name].css',{
  		allChunks: true
  	}),
  	/*new webpack.ProvidePlugin({ //全局加载jq,这样不用在引入时var $ = require("../js/jquery-1.11.2.min.js")
		  $: 'jquery'
	 }),*/
   new webpack.ProvidePlugin({
    jQuery: path.join(__dirname, "./js/jquery-1.11.2.min.js"),
    $: path.join(__dirname, "./js/jquery-1.11.2.min.js"),
    "window.jQuery": path.join(__dirname, "./js/jquery-1.11.2.min.js")
   }),  
	 new CleanPlugin (['./public']),
  new CommonsChunkPlugin({
    name: 'common', //公共模块提取生成名为common.js文件
    chunks: chunks,
    minChunks : chunks.length //提取所有entry共同依赖的模块
  }) ,
  //HtmlWebpackPlugin，模板生成相关的配置，每个对于一个页面的配置，有几个写几个
    new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
      favicon: './image/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
      filename: './pages/main.html', //生成的html存放路径，相对于path
      template: './pages/main.html', //html模板路径
      inject: 'body', //js插入的位置，true/'head'/'body'/false
      
    }),
    new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
      favicon: './image/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
      filename: './pages/contacts/contact_query.html', //生成的html存放路径，相对于path
      template: './pages/contacts/contact_query.html', //html模板路径
      inject: true, //js插入的位置，true/'head'/'body'/false
      
    }),
   
 /* new CopyWebpackPlugin([
    {
      from:__dirname+ '/pages',
      to: __dirname+ '/public/pages'
    }/*,
  
  ]),*/

   new UglifyJsPlugin({ //压缩代码
      compress: {
        warnings: false
      },
      except: ['$super', '$', 'exports', 'require'] //排除关键字
    }),
  ],
  resolve: {
    alias: {jquery: path.join(__dirname,"./js/jquery-1.11.2.min.js")},//注意这里的路径是调用jquery时候的路径，
    //而不是相对应path或config文件的路径，待研究
    extensions: ['','.js']//忽略后缀名没写，譬如require('index')等同require('index.js')
  },
  //自动补全css3前缀
  postcss: function () {
    return [Autoprefixer];
  },
  //即便构建之后文件变乱，也能在出错的时候找到源文件报错的地方
  devtool:'eval-sorce-map',
 devServer:{
    contentBase: "./public",//本地服务器所加载的页面在的目录
    colors: true,  //终端输出结果为彩色
    inline: true,  //实时刷新
    port: 8000,
    hot: true
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
console.log(getEntry(),'getEntry',chunks,'chunks---')
