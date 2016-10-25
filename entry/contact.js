
	require("../css/bootstrap.css");
	require("../css/cssStyle.css");
	require("../css/css3.css");
	require("../css/icon.css");

	//var $ = require("jquery");//只要在入口文件写上就行，contact.body.js不用再写

	var contactModule = require("../js/contact.body.js");
	

	$('.contactBtn').click(function(){
		contactModule.createContact();
		console.log($,'$----')
	})
