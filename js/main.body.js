

/**
 * 基础的一些封装
 */

var $ = require("jquery");
module.exports = function(){
 var baseModule = (function(){
	//ajax调用访问.处理json数据格式的数据转换成js对象
	var curPath=window.document.location.href;
	var pathName=window.document.location.pathname;
	var pos=curPath.indexOf(pathName);
	var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	
	//ajax响应消息
	var obj = {};
	var show = function(){
		console.log('show-------')
	}
	//服务端请求以json方式返回
	var baseAjax = function(options){
		$.ajax({
			url:options.url || "",
			type:options.method || "POST",
			async:options.async || true,
			data:options.data || {},
			//dataType:options.dataType || "json",
			beforeSend:function(XMLHttpRequest){
				if(options.beforeSendType){
					if(options.beforeSendType==="ajax"){
					//options.beforeSend();
						XMLHttpRequest.setRequestHeader("RequestType", "ajax"); 
						XMLHttpRequest.setRequestHeader( "Content-Type", "text/html;charset=UTF-8" );
					}
				}
			},
			success:function(responseText,status){
//				console.log(responseText);
				if(typeof options.callback === "function"){
					var obj = jQuery.parseJSON(responseText);
					if(obj.code && typeof(obj.code)==="string" && obj.code.trim().length>0 && obj.code==="sessionTimeOut"){
						location.href = projectName + "/account/loginAccount";
					}
					options.callback(obj);
				}
			},
			complete:function(){
				if(typeof options.complete ==="function"){
					options.complete();
				}
			},
			error:function(){
//				if(typeof options.errorMethod === "function"){
//					options.errorMethod();
//				}else{
//					location.href = projectName + "/error500.jsp";
//				}
			}
		});
	};
	//form表单选项
	var formFieldFactory = function(){
		this.availableType = {
			TEXT:"text",
			EMAIL:"email",
			HIDDEN:"hidden",
			BUTTON:"button",
			PASSWORD:"password"
		}
	}
	formFieldFactory.prototype = {
		makeField:function(){
			throw new Error("不允许在父类创建任何东西");
		}
	}
	var Html5FormFieldFactory = function(){};
	Html5FormFieldFactory.prototype = new formFieldFactory();
	Html5FormFieldFactory.prototype.makeField = function(options){
		var options = options ||{},
			type=options.type ||{},
			field;
			//暂时先弄一个hidden以后再补充
			switch(type){
				case this.availableType.HIDDEN:
					field = new Html5HiddenField(options);
					break;
				case this.availableType.BUTTON:
					field = new Html5ButtonField(options);
					break;
				case this.availableType.TEXT:
					field = new Html5TextField(options);
					break;
				case this.availableType.PASSWORD:
					field = new Html5PasswordField(options);
					break;					
				default:
					field = new Html5TextField(options);
					break;
			}
			return field;
	}
	//创建密码
	function Html5PasswordField(options){
		this.options = options;
	}
	Html5PasswordField.prototype.getElement = function(){
		var textField = document.createElement("input");
		textField.setAttribute("type","password");
		textField.setAttribute("id",this.options.id||"");
		textField.setAttribute("name",this.options.name ||"");
		textField.setAttribute("value",this.options.value||"");
		textField.setAttribute("placeholder",this.options.displayText||"");
		if(this.options.maxLength){
			textField.setAttribute("maxlength",this.options.maxLength);
		}
		return textField;
	}	
	//创建文本
	function Html5TextField(options){
		this.options = options;
	}
	Html5TextField.prototype.getElement = function(){
		var textField = document.createElement("input");
		textField.setAttribute("type","text");
		textField.setAttribute("id",this.options.id||"");
		textField.setAttribute("name",this.options.name ||"");
		textField.setAttribute("value",this.options.value||"");
		textField.setAttribute("placeholder",this.options.displayText||"");
		if(this.options.maxLength){
			textField.setAttribute("maxlength",this.options.maxLength);
		}
		if(this.options.readonly){
			textField.setAttribute("readonly",this.options.readonly);
		}
		return textField;
	}
	//结束创建文本
	function Html5HiddenField(options){
		this.options = options;
	}
	Html5HiddenField.prototype.getElement = function(){
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type","hidden");
		hiddenField.setAttribute("id",this.options.id||"");
		hiddenField.setAttribute("name",this.options.name ||"");
		hiddenField.setAttribute("value",this.options.value||"");
		return hiddenField;
	}
	function Html5ButtonField(options){
		
		this.options = options;
	}
	Html5ButtonField.prototype.getElement = function(){
		console.log(this.options);
	var buttonField = document.createElement("button");
		buttonField.setAttribute("id",this.options.id||"");
		var textNode = document.createTextNode(this.options.text || "缺省");
		buttonField.appendChild(textNode);
		if(this.options.className && typeof this.options.className =="string"){
			buttonField.className = this.options.className;
		};
		if(typeof this.options.eventMethod === "function"){
			buttonField.addEventListener(this.options.event || "click",this.options.eventMethod);
		}
		return buttonField;
	}
	
	//*秒后跳转
	var setJump = function(options){
		var target = options.text.indexOf("?");
		if(target>-1){
			$(options.attr).options.text(options.text.replace("?",options.count || 0));
		}
	    window.setTimeout(function(){
	        options.count--;
	        if(options.count > 0) {
	        	if(target===-1){
	        		if(options.attr){
	        			$(options.attr).text(options.count || 0);
	        		}
	        	}else{
	        		if(options.attr){
	        			$(options.attr).text(text.replace(options.count || 0));
	        		}
	        	}
	            setJump(options);
	        } else {
	        	if(options.addr){
	        		location.href=options.addr;
	        	}
	        }
	    }, 1000);
	};
	var show = false;
	var createUserInfo = function(element){
		var nrCover = document.getElementById("info_popups_nr");
		if(!nrCover){		
			var ulBody = document.createElement("ul");
			ulBody.className = "info_popups_nr";
			ulBody.id = "info_popups_nr";
			ulBody.innerHTML = "<li>个人信息</li><li>账户安全</li><li>云服务中心</li><li>注销</li>";
			document.body.appendChild(ulBody);
			
			document.body.addEventListener("click",function(e){
				var ulBody = document.getElementById('info_popups_nr')
				var e = e || window.e;
				var target = e.srcElement || e.targer;
				if(target.id !== element.getAttribute('id')&& ulBody){
					document.body.removeChild(ulBody);
				}	
			},false);
			
			ulBody.addEventListener("click",function(e){
				if(e.srcElement.nodeName==="LI"){
					var index = e.srcElement.index();
					location.href = projectName +"/account/setAccountOpreate?index=" + index;
				}
			},false)
		}else{
			document.body.removeChild(nrCover);
		}
		
		
		
		
			
		
//		bg.addEventListener("click",_removeCover,false);
	};
	
	//获取子元素的索引值
	HTMLElement.prototype.index = function () {
	    return index(this, 0);
	    function index(e, i) {
	    	//递归方法:判断如果没有前一个兄弟节点直接返回下标,否则下标加1
	        if (e.previousElementSibling === null) {
	            return i;
	        } else {
	            return index(e.previousElementSibling, i + 1);
	        }
	    }
	};
	
	return{
		//ajax发送所有数据都为json格式
		simpleSend:function(options){
			//客户端一定要写callback方法来实现客户端操作。否则没数据返回
			return baseAjax(options); 
		},
		//ajax session超时设置
		ajaxTimeOut:function(options){
			$.ajaxSetup({
				  contentType : "application/x-www-form-urlencoded;charset=utf-8",
				  complete : function(XMLHttpRequest, textStatus) {
					console.log(XMLHttpRequest);
				    var sessionstatus = XMLHttpRequest.getResponseHeader("sessionstatus"); // SessionTimeOut
				    console.log("session---->" + sessionstatus);
				    if (sessionstatus == "timeout") {
				    	debugger;
				      location.href = options.url || projectName + "/account/login";
				    }
				  }
			});
		},
		//获取项目名称
		projectPath:function(){
			return projectName;
		},
		//*秒后跳转
		jump:function(options){
			setJump(options);
		},
		//主页跳转到分支页面
		mainSkip:function(option){
			var href = "";			
			switch(option){
				case 0:
					href = projectName +"/contact/list";
					break;
				case 1:
					href = projectName +"/message/view";
					break;					
				case 2:
					href = projectName +"/calling/view";
					break;
				case 3:
					href = projectName +"/albums/view";
					break;					
				case 6:
					href =  projectName +"/security/centerShow";
					break;
			}
			return href;
		},
		//分支页面跳转到主页面
		subToMain:function(options){
			var id = options.attrId,
			method = options.method || {width:"hide"},
			type = options.type || "slow",
			href = options.href || "/account/main";
			if(!typeof(id)==="string"){
				return;
			}
			$("#" + id).click(function(event){
				$(this).animate(method,type,function(){
					window.location.href = projectName + href;
				});
			})
		},
		createFormFeild:function(options){
			//省去H5和H4的判断
			formFieldFactory = new Html5FormFieldFactory();
			var formField = formFieldFactory.makeField(options);
			return formField;
		},
		createDwrPushTarget:function(account){
			dwr.engine.setActiveReverseAjax(true);   
			dwr.engine.setNotifyServerOnPageUnload(true,true);
			dwr.engine.setErrorHandler(function(){
				console.log("dwr disconnect----------->");
			});
			securityPush.onSecurityRemote(account);
		},
		initToolBar:function(account){
			var userInfo = document.getElementById("userInfo");
			if(userInfo){
				userInfo.previousElementSibling.children[0].src = projectName +"/account/getAccountHeadIcon";
				userInfo.innerText = account;
				userInfo.className = 'userInfo'
				userInfo.addEventListener("click",function(){
					createUserInfo(userInfo);
				}, false);
			}
			
			var titleBtn = document.getElementById("titleBtn");
			if(titleBtn){
				titleBtn.addEventListener("click",function(e){
					var navigationEl = document.getElementById("navigationBar");
					if(navigationEl.childNodes.length>1){
						navigationEl.innerHTML = "";
					}else{
						navigationEl.zIndex = "9";
						var navigationBody = "<span></span><ul>";
						navigationBody += "<li><a href='" + projectName + "/contact/list'><img src='" + projectName +"/image/pic_img01.png'><p>通讯录</p></a></li>";
						navigationBody += "<li><a href='" + projectName + "/message/view'><img src='" + projectName +"/image/pic_img02.png'><p>短信</p></a></li>";
						navigationBody += "<li><a href='" + projectName +"/calling/view'><img src='" + projectName +"/image/pic_img03.png'><p>通话记录</p></a></li>";
						navigationBody += "<li><a href='" + projectName +"/albums/view'><img src='" + projectName +"/image/pic_img04.png'><p>相册</p></a></li>";
						navigationBody += "<li><a href='#'><img src='" + projectName +"/image/pic_img05.png'><p>时间管理</p></a></li>";
						navigationBody += "<li><a href='#'><img src='" + projectName +"/image/pic_img06.png'><p>浏览器书签</p></a></li>";
						navigationBody += "<li><a href='" + projectName + "/security/centerShow'><img src='" + projectName +"/image/pic_img07.png'><p>vargo安全</p></a></li></ul>";
						navigationEl.innerHTML = navigationBody;
						document.body.addEventListener('click',function(e){
							var e = e || window.e;
							var target = e.srcElement || e.targer;
							if(target !== titleBtn){
								navigationEl.innerHTML = '';
							}
						},false)
					}
				},false);
			}
			//设置消息
			baseModule.setMessageCount(account);
			
			var noticeEl = document.getElementById("noticeMessage");
			var msgList = document.getElementById('messageList');
			var nextMsg = document.getElementById('next-msg');
			//设置读取消息
			if(noticeEl){
				document.body.addEventListener('click',function(e){
					var e = e || window.e;
					var target = e.srcElement || e.targer;
					if(target.id !== 'noticeMessage'){
						msgList.style.display = 'none';
					}
				},true)
				noticeEl.addEventListener("click",msgNextEvent,false);
				if(nextMsg){
					nextMsg.addEventListener("click",msgNextEvent,false);
				}
				
			}
			
			function msgNextEvent(){
				if(msgList.style.display == 'none'){
					var count = noticeEl.children[1].innerText;
					if(count!=="0"){
						baseAjax({
							url:projectName +"/support/getMessageDetail",
							method:"POST",
							data:{account:account,count:1},
							callback:function(obj){
								var liEle = '';
								var data = obj.messages;
								for(var i=0; i<data.length; i++){
									liEle +='<li>'+
										'<div class="time">'+data[i].receiveDate+'</div>'+
										'<div>'+noticeTitle.getBody(data[i].mouduleCode)+data[i].mouduleCode+'</div>'+
										'</li>' 
								};
								
								msgList.innerHTML=liEle;
								var a = document.createElement('a');
								a.id = "next-msg";
								a.innerHTML='下一页';								
								msgList.appendChild(a)
								msgList.style.display = 'block'
							}
						});
					}
				}else{
					msgList.style.display = 'none'
				}
			};
		},
		//设置消息数量
		setMessageCount:function(account){
			baseAjax({
				url:projectName +"/support/getPushResultCount",
				method:"POST",
				data:{account:account},
				callback:function(obj){
					var messageBar = document.getElementById("noticeMessage");
					if(messageBar){
						messageBar.children[1].innerText = obj.body;
					}
				}
			});
		},
		setPushMessageCount:function(count){
			var messageBar = document.getElementById("noticeMessage");
			if(messageBar){
				messageBar.children[1].innerText = count;
			}
		},
		getPathName:function(){
			return pathName.substring(pathName.substr(1).lastIndexOf('/')+1);;
		}
	};
}())
//静态资源根据邮箱跳转
var emailHash = (function(){
	var hash={   
		'qq.com': 'http://mail.qq.com',   
		'gmail.com': 'http://mail.google.com',   
		'sina.com': 'http://mail.sina.com.cn',   
		'163.com': 'http://mail.163.com',   
		'126.com': 'http://mail.126.com',   
		'yeah.net': 'http://www.yeah.net/',   
		'sohu.com': 'http://mail.sohu.com/',   
		'tom.com': 'http://mail.tom.com/',   
		'sogou.com': 'http://mail.sogou.com/',   
		'139.com': 'http://mail.10086.cn/',   
		'hotmail.com': 'http://www.hotmail.com',   
		'live.com': 'http://login.live.com/',   
		'live.cn': 'http://login.live.cn/',   
		'live.com.cn': 'http://login.live.com.cn',   
		'189.com': 'http://webmail16.189.cn/webmail/',   
		'yahoo.com.cn': 'http://mail.cn.yahoo.com/',   
		'yahoo.cn': 'http://mail.cn.yahoo.com/',   
		'eyou.com': 'http://www.eyou.com/',
		'21cn.com': 'http://mail.21cn.com/',   
		'188.com': 'http://www.188.com/',   
		'foxmail.coom': 'http://www.foxmail.com',
		'vargo.com.cn': 'http://qiye.163.com/login/',
		'ivargo.com': 'http://mail.ivargo.com'
	};
	return{
		getEmailAddr:function(option){
    		for (var j in hash){   
    			option.url=hash[option.email];
    		}
    		return option.url
		}
	}
}());


var noticeTitle = {
	"105":"手机找回",
	"106":"云端删除",
	"107":"云端锁定",
	"108":"云端解锁",
	"109":"云端备份",
	"113":"云端销毁",
	"116":"云端挂失",
	"117":"云端解除挂失",
	"118":"云端备份进度",
	getBody:function(val){
		var name = "";
		for(x in this){
			if(x == val){
				name = this[x];
				break;
			}
		}
		return name;
	}
}


var showMessage = function(msg){
	var obj = jQuery.parseJSON(msg);
	console.log(obj);
	if(obj){
		if(obj.pushType){
			switch(obj.pushType){
				//推送类型为1 安全模块处理。
				case 1:
					//console.log("进入到安全处理")
					console.log(baseModule.getPathName());
//					if(securityModule.securityPushResult){
					if(pushCurrentPage.isCurrentPage(1,"/security" + baseModule.getPathName())){
						if(typeof(securityModule.securityPushResult)==="function"){
							securityModule.securityPushResult(obj);
						}
					}else{
						//如果不在当前页面则刷新一下
						console.log("不在安全页面");
						baseModule.setMessageCount(obj.account);
					}
					break;
				case 9:
					//设置消息数目
					baseModule.setPushMessageCount(obj.baseContent);
				default:
					break;
			}
		}
	}
}

var pushCurrentPage = {
	1:["/security/centerShow","/security/operate"],
	isCurrentPage:function(index,val){
		var result = false;
		var module = this[index];
		if(module instanceof Array){
			for(var i=0;i<module.length;i++){
				if(module[i]===val){
					result = true;
					break;
				}
			}
		}
		return result;
	}
}

Array.prototype.repeat = function(){
	var hash = {},
    len = this.length,
    result = [];
	for (var i = 0; i < len; i++){
		if (!hash[this[i]]){
			hash[this[i]] = true;
			result.push(this[i]);
		} 
	}
	return result;
};

Array.prototype.indexOf = function(val) { //prototype 给数组添加属性
	var length = this.length
    for (var i = 0; i < length; i++) { //this是指向数组，this.length指的数组类元素的数量
        if (this[i] == val) return i; //数组中元素等于传入的参数，i是下标，如果存在，就将i返回
    }
    return -1;
};
Array.prototype.remove = function(val) {   //prototype 给数组添加属性
 var index = this.indexOf(val);  //调用index()函数获取查找的返回值
 if (index > -1) {
     this.splice(index, 1);  //利用splice()函数删除指定元素，splice() 方法用于插入、删除或替换数组的元素
 }
};
exports.showMessage = showPopWin;
//显示弹出框和蒙版
var showPopWin = function(obj){
	$(obj).show();
	$('.mask').fadeIn();
};

//点击弹出框的关闭按钮或取消按钮时，弹出框和蒙版隐藏
var hidePopWin = function(obj){
	$(obj).hide();
	$('.mask').fadeOut();
}

/*
cookie的存取addCookie
cookie的修改editCookie
cookie的获取getCookieValue
options:
	name //cookie名字
	value //cookie值
	expiresHours //有效时间
*/
//发送验证码时添加cookie
function addCookie(name,value,expiresHours){ 
	var cookieString=name+"="+escape(value); 
	//判断是否设置过期时间,0代表关闭浏览器时失效
	if(expiresHours>0){ 
	    var date=new Date(); 
	    date.setTime(date.getTime()+expiresHours*1000); 
	    cookieString=cookieString+";expires=" + date.toUTCString(); 
	} 
	    document.cookie=cookieString; 
} 
//修改cookie的值
function editCookie(name,value,expiresHours){ 
	var cookieString=name+"="+escape(value); //escape()用于让计算机可识别，可以读入取出
	if(expiresHours>0){ 
	  var date=new Date(); 
	  date.setTime(date.getTime()+expiresHours*1000); //单位是毫秒
	  cookieString=cookieString+";expires=" + date.toGMTString(); 
	} 
	  document.cookie=cookieString; 
} 
//根据名字获取cookie的值
function getCookieValue(name){ 
  var strCookie=document.cookie; 
  var arrCookie=strCookie.split("; "); 
  for(var i=0;i<arrCookie.length;i++){ 
    var arr=arrCookie[i].split("="); 
    if(arr[0]==name){
      return unescape(arr[1]);
      break;
    }else{
         return ""; 
         break;
     } 
  }    
}

//获取事件兼容
var getEvent = function(e){
	return e ? e : window.event;
};

//获取事件目标兼容
var getTarget = function(e){
	return getEvent(e).target || getEvent(e).srcElement;
}

//阻止事件冒泡
var stopPropagation = function(e){
	if(e && e.stopPropagation()){
		e.stopPropagation()
	}else{
		window.event.cancelBubble = true;
	}
}

return {
	baseModule: baseModule,
	stopPropagation: stopPropagation,
	showPopWin: showPopWin,
	getCookieValue : getCookieValue,
	emailHash: emailHash//等等
}

}


