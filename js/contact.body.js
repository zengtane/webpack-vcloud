
/**
 * 通讯录组件的一些封装
 * doc: id{"_contact_info:":"新建联系人(姓氏,名字,昵称,公司,部门,职务,同事)[ul]","_mobileDesc":"电话[ul]","_emailDesc":"邮箱","_contact_group":"群组"}
 */
 var main = require("./main.body.js");//这个在哪里调用就在那里require
var contactModule = (function(){
	var charMatch = /^[A-Za-z]+$/,
	//项目路径
	projectName = main().baseModule.projectPath(),
	unSelectClass = "unselect",
	SelectClass = "select",
	selectIndex = 0,
	selectEmptyId = "selectEmptyId",
	delContacts = [],
	contactDetail = {},
	mobileDescIndex = 0,
	emailsdfsfdfsdDescIndex = 0,
	//修改时候储存的group,群组信息。
	groupInfo = [],
	//其他信息
	otherItem = [],
	//默认高度
	mobielDescTop = [340,358],
	vargoId = "",
	filterCharToPingyin = function(options){
		if(options.rows.length>0){
			//计算字母分类标签
			var initials = [];
			var length = options.rows.length; 
			for(var i =0;i<length;i++){
				var fullName = options.rows[i].fullName;
				if(fullName == undefined){
					funnName = "无名称";
				}
				var initial = makePy(fullName)[0].toUpperCase();
				initial = initial.charAt(0);
				if(charMatch.test(initial)){
					if(initials.indexOf(initial)===-1){
						initials.push(initial.charAt(0));
					}
				}else{
					options.isDefault = true;
				}
			}
			//去重
			initials = repeatArray(initials);
			//按照字母排序
			initials.sort();
			options.initials = initials;
		}
		return options;
	},
	//数组去重复
	repeatArray = function(a){
		 var hash = {},
		     len = a.length,
		     result = [];
		 for (var i = 0; i < len; i++){
		     if (!hash[a[i]]){
		         hash[a[i]] = true;
		         result.push(a[i]);
		     } 
		 }
		 return result;
	},
	insertAfter = function(newEl,targetEl){
		var parentEl = targetEl.parentNode;
		if(parentEl.lastChild==targetEl){
			parentEl.appendChild(newEl);
		}else{
			parentEl.insertBefore(newEl,targetEl.nextSibling);
		}
	},
	contactListHandle = function(e){
		var nodeName = e.srcElement.nodeName;
		switch(nodeName){
			case "BUTTON":
				contactButtonHandle(e);
				break;
			case "LI":
				contactLiHandle(e);
				break;
			case "EM":
				if(e.type==="click"){
					e.typle="click";
					e.srcElement.id = e.srcElement.parentElement.id;
					contactLiHandle(e);
				}
				break;
			case "SPAN":
				if(e.type==="click"){
					e.typle="click";
					e.srcElement.id = e.srcElement.parentElement.id;
					contactLiHandle(e);
				}
				break;				
			default:
				break;
		}
	},
	//通讯录左侧鼠标点击事件
	contactButtonHandle = function(e){
		var type = e.type;
		var element = e.target;
		var isSelect = element.className;
		switch(type){
			case "mouseover":
				if(isSelect === unSelectClass){
					element.style.backgroundImage = "url(" + projectName + "/image/icon05.png)";
				}
				break;
			case "mouseout":
				if(isSelect === unSelectClass){
					element.style.backgroundImage = "url(" + projectName + "/image/icon04.png)";
				}
				break;
			case "click":
				contactListButtonClick(e);
				break;
			default:
				break;
		}
	},
	contactListButtonClick = function(e){
		var className = e.target.className;
		var target = getTarget(e);
		var id = target.parentNode.id;
		var text = target.parentNode.innerText;
		var allSelect = document.getElementById("allSelect");
		if(className === unSelectClass){
			e.target.className = SelectClass;
			e.target.style.backgroundImage = "url(" + projectName + "/image/icon05.png)";
			//全局计算有多少选中
			selectIndex++;
			if(allSelect.style.display==="none"){
				allSelect.style.display="block";
			}
			appendToRightElement({
				contactId:id,
				bodyText:text
			});
			delContacts.push(id);
		}else{
			e.target.className = unSelectClass;
			e.target.style.backgroundImage = "url(" + projectName + "/image/icon04.png)";
			//计算全局选中数
			selectIndex--;
			if(selectIndex<=0){
				allSelect.style.display = "none";
				createSelectEmptyNode();
			}else{
				removeDelElement({
					contactId:id
				});
			}
			delContacts.remove(id);
		}
	},
	//获取通讯录详情
	contactLiHandle = function(e){
		var type = e.type;
		if(type==="click"){
			removeRightElement();
			cancelAllContacts();
			var id = e.srcElement.id;
			main().baseModule.simpleSend({
				url:main().baseModule.projectPath() +"/contact/getContactDetailsByCondition",
				data:{contactId:id},
				method:"post",
				callback:function(obj){
					contactDetail = obj;
					createContactView(contactDetail);
				}
			});
		}
	},
	
	createContactView = function(options){
		removeRightElement();
		//---------------------创建上半部分----------------------------
		var infoEl = document.createElement("div");
		infoEl.className = "detail_info";
		
		var titleEl = document.createElement("h4");
		titleEl.innerHTML = "联系人详情";
		
		var bodyEl = document.createElement("div");
		bodyEl.className = "edit_info info_edit";
		bodyEl.id = "_contact_info";
		//如果没有图片的话
		var imgEl = document.createElement("img");
		imgEl.src = projectName + "/image/default.jpg";
		
		var ulEl = document.createElement("ul");
		var li1El = document.createElement("li");
		li1El.innerHTML = "<span>" + options.firstName + "</span><span>" + (options.givenName=== undefined?"":options.givenName) +"</span>";
		ulEl.appendChild(li1El);

		var li2El = document.createElement("li");
		li2El.innerHTML = "<span>" + (options.nick ===undefined?"":options.nick) + "</span><span>" + (options.company===undefined?"":options.company) +"</span>";		
		ulEl.appendChild(li2El);
		var li3El = document.createElement("li");
		var ttt = "<span>" + (options.department === undefined?"":options.department) + "</span><span>" + (options.duties === undefined?"":options.duties) +"</span>";
		li3El.innerHTML = 	ttt;
		ulEl.appendChild(li3El);
/*		var li4El = document.createElement("li");
		ulEl.appendChild(li4El);*/
		
		bodyEl.appendChild(imgEl);
		bodyEl.appendChild(ulEl);
		
		infoEl.appendChild(titleEl);
		infoEl.appendChild(bodyEl);
		
		//-------------------下半部分分割线------------------------------
		var mainEl = document.createElement("div");
		mainEl.className = "infoMiddle";
		//-----------------------电话号码展示-------------------------------
		
		if(options.mobile && options.mobile.length>0){
			var TelUlEl = document.createElement("ul");
			TelUlEl.className = "tel";
			var telIndex = options.mobile.length;
			for(var i=0;i<telIndex;i++){
				var mobileEl = document.createElement("li");
				var tmpMobile = options.mobile[i];
				mobileEl.innerHTML = "<em>" + tmpMobile.mobileDesc +"</em><span>"+ tmpMobile.mobile +"</span>";
				TelUlEl.appendChild(mobileEl);
			}
			mainEl.appendChild(TelUlEl);
		}
		//-----------------------电子邮箱展示-------------------------------
		if(options.emails && options.emails.length>0){
			var emailUlEl = document.createElement("ul");
			emailUlEl.className = "company";
			var telIndex = options.emails.length;
			for(var i=0;i<telIndex;i++){
				var emailEl = document.createElement("li");
				var tmpMobile = options.emails[i];
				emailEl.innerHTML = "<em>" + tmpMobile.emailDesc +"</em><span>"+ tmpMobile.email +"</span>";
				emailUlEl.appendChild(emailEl);
			}
			
			mainEl.appendChild(emailUlEl);
		}
		//----------------------------群组信息展示-------------------------
		if(options.groups && options.groups.length>0){
			var groupUlEl = document.createElement("ul");
			groupUlEl.className = "company";
			var groupBodyLi = document.createElement("li");
			var liBody = "<em>群组</em>";
			var length = options.groups.length;
			var tmpGroupList = [];
			for(var i=0;i<length;i++){
				var tmp = options.groups[i];
				tmpGroupList[i] = tmp.groupName;
			}
			liBody += tmpGroupList.join("|");
			groupBodyLi.innerHTML = liBody;
			groupUlEl.appendChild(groupBodyLi);
			mainEl.appendChild(groupUlEl);
		}
		//------------------------其他信息展示---------------------------------
//		console.log(options);
		if((options.im && options.im.length>0) || (options.address && options.address.length>0) || 
				(options.sip && options.sip.length>0) || (options.website && options.website.length>0)){
			var otherUlEl = document.createElement("ul");
			otherUlEl.className = "company";
//			var groupBodyLi = document.createElement("li");
			var otherBody = "";
			if(options.website && options.website.length>0){
				otherBody += "<li><em>网站</em>" + options.website + "</li>"
			}
			if(options.im && options.im.length>0){
				otherBody += "<li><em>聊天工具</em>" + options.im + "</li>"
			}
			if(options.address && options.address.length>0){
				otherBody += "<li><em>地址</em>" + options.address + "</li>"
			}			
			if(options.sip && options.sip.length>0){
				otherBody += "<li><em>SIP</em>" + options.sip + "</li>"
			}
			otherUlEl.innerHTML = otherBody;
			mainEl.appendChild(otherUlEl);
		}
		//------------------------按钮的分割线-----------------------------
		var btnEl = document.createElement("div");
		btnEl.className = "btn_txt";
		
		var cancelBtn = document.createElement("button")
		var btnCancelText = document.createTextNode("取消");
		cancelBtn.appendChild(btnCancelText);
		cancelBtn.addEventListener("click",cancelAllContacts,false);
		
		var confirm = document.createElement("button");
		var btnConfirmText = document.createTextNode("编辑");
		confirm.className = "createBtn W_btn"
		confirm.appendChild(btnConfirmText);
		//添加通讯录submit事件绑定
		confirm.addEventListener("click",function(){
			options.type = "update";
			options.title = "编辑联系人";
			createOrUpdate(options);
		},false);
		
		var delBtn = document.createElement("button")
		//var btnCancelText = document.createTextNode("取消");
		var delImg = document.createElement("img");
		delImg.src = projectName + "/image/message_delete.png";
		delBtn.appendChild(delImg);
		//事件添加
		delBtn.addEventListener("click", createDeleteCover, false);
		

		btnEl.appendChild(cancelBtn);
		btnEl.appendChild(confirm);
		btnEl.appendChild(delBtn);

		var parentEl = document.getElementById("rightElement");
		parentEl.appendChild(infoEl);
		parentEl.appendChild(mainEl);
		parentEl.appendChild(btnEl);
	},
	
	//创建新建和修改内容
	createOrUpdate = function(options){
		if(options.groups && options.groups.length > 0){
			groupInfo = options.groups;
		}else{
			groupInfo = [];
		}
		//其他信息初始化
		otherItem = ["网站","聊天工具","地址","SIP"];
		cancelAllContacts();
		removeRightElement();
		//创建6个input
		//创建姓
		var firstName = main().baseModule.createFormFeild({
			type:"text",
			maxLength:10,
			displayText:"姓氏",
			id:"contact_firstname",
			value:options.firstName===undefined?"":options.firstName
		});
		//创建名字
		var givenName =  main().baseModule.createFormFeild({
			type:"text",
			maxLength:10,
			displayText:"名字",
			id:"contact_givenname",
			value:options.givenName===undefined?"":options.givenName
		});
		//创建昵称
		var nick =  main().baseModule.createFormFeild({
			type:"text",
			maxLength:10,
			displayText:"昵称",
			id:"contact_nick",
			value:options.nick===undefined?"":options.nick
		});
		//创建公司
		var company =  main().baseModule.createFormFeild({
			type:"text",
			maxLength:10,
			displayText:"公司",
			id:"contact_company",
			value:options.company===undefined?"":options.company
		});				
		var dept =  main().baseModule.createFormFeild({
			type:"text",
			maxLength:10,
			displayText:"部门",
			id:"contact_dept",
			value:options.department===undefined?"":options.department
		});
		var duties =  main().baseModule.createFormFeild({
			type:"text",
			maxLength:10,
			displayText:"职务",
			id:"contact_dept",
			value:options.duties===undefined?"":options.duties
		});
		var worker =  main().baseModule.createFormFeild({
			type:"text",
			maxLength:10,
			displayText:"同事",
			id:"contact_worker",
			value:options.duties===undefined?"":options.duties
		});		
		var headEl = document.createElement("div");
		headEl.className = "detail_info";
		var titleH4 = document.createElement("h4");
		titleH4.innerHTML = options.title || "新建联系人";
		headEl.appendChild(titleH4);
		var infoEl = document.createElement("div");
		infoEl.className = "edit_info";
		var imgEl = document.createElement("img");
		imgEl.src = projectName + "/image/default.jpg";
		infoEl.appendChild(imgEl);
		var infoUl = document.createElement("ul");
		infoUl.id="_contact_info";
		var li1 = document.createElement("li");
		li1.appendChild(firstName.getElement());
		li1.appendChild(givenName.getElement());
		infoUl.appendChild(li1);

		
		var li2 = document.createElement("li");
		li2.appendChild(nick.getElement());
		li2.appendChild(company.getElement());
		infoUl.appendChild(li2);
		
		var li3 = document.createElement("li");
		li3.appendChild(dept.getElement());
		li3.appendChild(duties.getElement());
		infoUl.appendChild(li3);
		
		var li4 = document.createElement("li");
//		li4.appendChild(worker.getElement());
		li4.innerHTML = "<input type='text' maxLength='10' placeholder='同事'>";
		infoUl.appendChild(li4);
		
		infoEl.appendChild(infoUl);
		headEl.appendChild(infoEl);
		var parentElement= document.getElementById("rightElement");
		parentElement.appendChild(headEl);
		//---------------------------一共两部分。我是华丽的分割线----------------------------
		var mainEl = document.createElement("div");
		mainEl.className = "infoMiddle";
		mainEl.id="contactMainBody";
//		var memoUl = document.createElement("ul");
//		memoUl.innerHTML = "<li><em>备注</em><input type='text'></li>";
//		mainEl.appendChild(memoUl);
		
		//手机号码
		var mobileUl = document.createElement("ul");
		mobileUl.className = "tel";
		mobileUl.id = "_mobileDesc";
		var mobileEmpty = "<li><em>ivargo</em><input type='text' value='' placeholder='电话'><b>+</b></li>";
		
		if(options.mobile===undefined){
			mobileUl.innerHTML = mobileEmpty;
		}else{
			var tmpMobiles = "";
			var length = options.mobile.length;
			for(var i=0;i<length;i++){
				var inputType = "";
				if(i===0){
					inputType ="<b>+</b>";
				}else{
					inputType ="<b>-</b>";
				}
				var tmp = options.mobile[i];
				tmpMobiles += "<li><em>"+ tmp.mobileDesc +"</em><input type='text' value='" + tmp.mobile +"' placeholder='电话'>" + inputType + "</li>";
				//真的很烦。坐标绝对值的偏移量。编辑联系人。
				mobielDescTop[0] = mobielDescTop[0]+30;
				mobielDescTop[1] = mobielDescTop[1]+30;
			}
			mobileUl.innerHTML = tmpMobiles.length===0?mobileEmpty:tmpMobiles;
		}
		mobileUl.addEventListener("click",mobileNodeChoice,false);
		mainEl.appendChild(mobileUl);
		//邮箱
		var emailUl = document.createElement("ul");
		emailUl.className = "company";
		emailUl.id="_emailDesc";
		var emptyEmail = "<li><em>公司邮箱</em><input type='text' value='' ><b>+</b></li>"
		if(options.emails === undefined || options.emails.length<1){
			emailUl.innerHTML = emptyEmail;
		}else{
			var tmpEmails = "";
			var length = options.emails.length;
			for(var i=0;i<length;i++){
				var inputType = "";
				if(i===0){
					inputType ="<b>+</b>";
				}else{
					inputType ="<b>-</b>";
				}
				var tmp = options.emails[i];
				tmpEmails += "<li><em>"+ tmp.emailDesc +"</em><input type='text' value='" + tmp.email +"' placeholder='电话'>" + inputType + "</li>";
			}
			emailUl.innerHTML = tmpEmails.length===0?tmpEmails:tmpEmails;
		}
		emailUl.addEventListener("click",emailNodeChoice,false);
		mainEl.appendChild(emailUl);
		//群组
		var groupLength = groupInfo.length;
		var tmpGroupList = [];
		for(var i=0;i<groupLength;i++){
			var temp = groupInfo[i];
			tmpGroupList[i] = temp.groupName;
		}
		var groupUl = document.createElement("ul");
		groupUl.innerHTML = "<li><em>群组</em><input type='text' readonly='readonly' id='groupText' value='" + tmpGroupList.join(",") + "'><b id='addGroups'>∨</b></li>";
		groupUl.id = "_contact_group"
		mainEl.appendChild(groupUl);
		//为群组绑定事件
		groupUl.addEventListener("click",function(e){
			getGroupInfo(e,options.contactId);	
		},false);
		//--------------------构建其他信息----------------------
		var otherUlEl = document.createElement("ul");
		otherUlEl.className = "company";
		otherUlEl.id = "_contact_other";
		var otherBody = "";
		if((options.im && options.im.length>0) || (options.address && options.address.length>0) || 
				(options.sip && options.sip.length>0) || (options.website && options.website.length>0)){

//			var groupBodyLi = document.createElement("li");
			
			if(options.website && options.website.length>0){
				otherBody += "<li><em>网站</em><input type='text' id='groupText' value='" + options.website + "'><b>-</b></li>";
				otherItem.remove("网站");
			}
			if(options.im && options.im.length>0){
				otherBody += "<li><em>聊天工具</em><input type='text' id='groupText' value='" + options.im + "'><b>-</b></li>";
				otherItem.remove("聊天工具");
			}
			if(options.address && options.address.length>0){
				otherBody += "<li><em>地址</em><input type='text' id='groupText' value='" + options.address + "'><b>-</b></li>";
				otherItem.remove("地址");
			}			
			if(options.sip && options.sip.length>0){
				otherBody += "<li><em>SIP</em><input type='text' id='groupText' value='" + options.sip + "'><b>-</b></li>";
				otherItem.remove("SIP");
			}
		}
		if(otherBody.length>0){
			otherUlEl.innerHTML = otherBody;
		}
		mainEl.appendChild(otherUlEl);
		otherUlEl.addEventListener("click",function(e){
			if(e.srcElement.nodeName==="B"){
				//获取文本
				var text = e.srcElement.parentElement.firstChild.innerText;
				//单选设置。可以继续被全局添加
				otherItem.push(text);
				//删除元素
				e.srcElement.parentElement.parentElement.removeChild(e.srcElement.parentElement);				
			}
		},false)		
		
		//创建[新建信息按钮]按键
		var messageButton = main().baseModule.createFormFeild({
			type:"button",
			text:"新建信息",
			id:"newMessage",
			eventMethod:createNewInfo
		});
		mainEl.appendChild(messageButton.getElement());
		parentElement.appendChild(mainEl);
		
		var btnEl = document.createElement("div");
		btnEl.className = "btn_txt";
		
		var cancelBtn = document.createElement("button")
		var btnCancelText = document.createTextNode("取消");
		cancelBtn.appendChild(btnCancelText);
		cancelBtn.addEventListener("click",cancelAllContacts,false);
		var confirm = document.createElement("button");
		if(options.type){
			var btnConfirmText = document.createTextNode("编辑");
			confirm.className = "createBtn"
			confirm.appendChild(btnConfirmText);
			//contactDetail.vargoId = options.vargoId;
			//contactDetail.contactId = options.contactId;
			//添加通讯录submit事件绑定
			confirm.addEventListener("click",function(){
				updateContactDetail(options);
			},false);
		}else{
			var btnConfirmText = document.createTextNode("确定");
			confirm.className = "createBtn"
			confirm.appendChild(btnConfirmText);
			//添加通讯录submit事件绑定
			confirm.addEventListener("click",addContactDetail,false);
		}
		
		btnEl.appendChild(cancelBtn);
		btnEl.appendChild(confirm);
		
		parentElement.appendChild(btnEl);
	},
	//获取详情页面的群组消息
	getGroupInfo = function(e,contactId){
		var target = e.srcElement;
		//stopPropagation(e)		
		if(target.tagName = "B"){
			if(target.innerText ==="∨"){
				main().baseModule.simpleSend({
					url:main().baseModule.projectPath() +"/contact/group",
					method:"GET",
					callback:groupCallBack
				});
				function groupCallBack(obj){
					var innerBody = "";
					if(obj.length>0){
						var length = obj.length;
						for(var i =0;i<length;i++){
							innerBody += "<li id='" + obj[i].groupId + "'><label><input name='grouplist' type='checkbox' value='" + obj[i].groupName +"'";
							var groupLength = groupInfo.length;
							for(var f=0;f<groupLength;f++){
								var tmp = groupInfo[f];
								if(tmp.groupId === obj[i].groupId){
									innerBody += " checked=checked";
									break;
								}
							}
							innerBody += ">" + obj[i].groupName + "</label></li>"
						}
					}
					innerBody += "<li>新建群组</li>";

					var groupEl = document.createElement("div");
					groupEl.className = "group";
					groupEl.id = "group"
					var groupUl = document.createElement("ul");
					groupUl.innerHTML = innerBody;
					groupEl.appendChild(groupUl);
					var spanEl = document.createElement("span");
					groupEl.appendChild(spanEl);
					
					//改变checkbox的选中状态
					groupUl.addEventListener("change",function(e){
						stopPropagation(e)
						var groupId = e.srcElement.parentElement.id;
						if(e.srcElement.checked){
							var groupName = e.srcElement.value;
							var groupObj = new Object();
							groupObj.groupId = groupId;
							groupObj.vargoId = vargoId;
							if(contactId){
								groupObj.contactId = contactId;
							}
							groupObj.groupName = groupName;
							//插入到待修改列表中
							groupInfo.push(groupObj);
							//修改页面显示
							var inputView = document.getElementById("groupText");
							if(inputView){
								var str = inputView.value +"";
								var tmpPush = str.split(",");
								tmpPush.push(groupName);
								inputView.value = tmpPush.join(",");
							}
						}else{
							var length = groupInfo.length;
							var groupName = e.srcElement.value;
							for(var i=0;i<length;i++){
								var tmp = groupInfo[i];
								if(tmp.groupId === groupId){
									groupInfo.splice(i,1);
									break;
								}
							}
							//修改页面显示
							var inputView = document.getElementById("groupText");
							if(inputView){
								var str = inputView.value +"";
								var tmpPush = str.split(",");
								tmpPush.remove(groupName);
								inputView.value = tmpPush.join(",");
							}
						}
					},false);
					
					document.body.addEventListener('click', function(e){
							var groupUl = document.getElementById('group');
							if(groupUl){
								groupUl.parentNode.removeChild(groupUl);
								target.innerHTML ="∨";
							}
						}, false)
					groupEl.addEventListener("click",function(e){
						stopPropagation(e);
						var srcEl = e.srcElement;
						if(srcEl.innerText === "新建群组"){
							showPopWin('creat_group')
							showCreateGroup();
						}else{
							
						}
					},false);
					var _contact_group_li = document.getElementById('_contact_group').getElementsByTagName('li')[0]
					_contact_group_li.appendChild(groupEl);
					target.innerHTML ="∧";
					
				}
			}else if(target.innerText ==="∧"){
				target.innerText ="∨";
				var groupUl = document.getElementById('group');
				if(groupUl){
					groupUl.parentNode.removeChild(groupUl);
				}
				
				
			}
		}
	},
	addContactDetail = function(){
		var obj = getContactDetail();
		obj.vargoId = vargoId;
		//验证
		var requestData = JSON.stringify(obj);
		//var requestData = JSON.stringify(obj);
		//console.log(requestData);
		$.ajax({
			url:projectName + "/contact/save",
			data:{"josnbean":encodeURI(requestData)},
			beforeSend: function(XMLHttpRequest){ 
				XMLHttpRequest.setRequestHeader("RequestType", "ajax"); 
				XMLHttpRequest.setRequestHeader( "Content-Type", "text/html;charset=UTF-8" ); 
			}, 		
			success:function(obj){
				//alert("添加成功");
				location.reload();
				//console.log(obj);
			}
		});
	},
	updateContactDetail = function(options){
		var obj = getContactDetail();
		console.log(obj);
		obj.vargoId = vargoId;
		obj.contactId = options.contactId;
		//验证
		var requestData = JSON.stringify(obj);
//		console.log(requestData);
		createLodingCover();
		$.ajax({
			url:projectName + "/contact/updateContact",
			data:{"josnbean":encodeURI(requestData)},
			beforeSend: function(XMLHttpRequest){ 
				XMLHttpRequest.setRequestHeader("RequestType", "ajax"); 
				XMLHttpRequest.setRequestHeader( "Content-Type", "text/html;charset=UTF-8" ); 
			}, 		
			success:function(obj){
				//alert("添加成功");
				location.reload();
//				console.log(obj);
			}
		});
	},
	//id{"_contact_info:":"新建联系人(姓氏,名字,昵称,公司,部门,职务,同事)[ul]","_mobileDesc":"电话[ul]","_emailDesc":"邮箱","_contact_group":"群组"}
	getContactDetail = function(){
		//验证输入
		var result = 0;
		//需要传输的数据
		var obj = {};
		var contactInfo = document.getElementById("_contact_info").childNodes;
		console.log(contactInfo[0].childNodes[0].value);
		//姓
		obj.firstName =contactInfo[0].childNodes[0].value;
		result = obj.firstName.length>0?++result:result;
		//名
		obj.givenName = contactInfo[0].childNodes[1].value;
		result = obj.givenName.length>0?++result:result;
		//昵称
		obj.nick = contactInfo[1].childNodes[0].value;
		result = obj.nick.length>0?++result:result;
		//公司
		obj.company = contactInfo[1].childNodes[1].value;
		result = obj.company.length>0?++result:result;
		//部门
		obj.department = contactInfo[2].childNodes[0].value;
		result = obj.department.length>0?++result:result;
		//职务
		obj.duties = contactInfo[2].childNodes[1].value;
		result = obj.duties.length>0?++result:result;
		//同事 这个字段前端可能没有
		obj.worker = contactInfo[3].childNodes[0].value;
		//result = obj.duties.length>0?result++:result;
		//-----------------------我是华丽的分割线 下面是电话号码统计----------------------------
		obj.mobile = [];
		var _mobileDesc = document.getElementById("_mobileDesc").childNodes;
		var mobileLength = _mobileDesc.length;
		for(var i =0;i<mobileLength;i++){
			var tempEl = _mobileDesc[i];
			var mobile = tempEl.childNodes[1].value;
			if(mobile.length>0){
				var desc = tempEl.firstChild.innerHTML;
				var tmpBean = {
					mobileDesc:desc,
					mobile:mobile
				};
				obj.mobile.push(tmpBean);
				result = result++;
			}
		}
		//-----------------------我是华丽的分割线 下面是邮箱统计----------------------------		
		obj.emails = []
		var _emailDesc = document.getElementById("_emailDesc").childNodes;
		var emailLength = _emailDesc.length;
		for(var i=0;i<emailLength;i++){
			var tempEl = _emailDesc[i];
			var email = tempEl.childNodes[1].value;
			if(email.length>0){
				var desc = tempEl.firstChild.innerHTML;
				var tmpBean = {
					emailDesc:desc,
					email:email
				};
				obj.emails.push(tmpBean);
				result = result++;
			}
		}
		//-----------------------我是华丽的分割线 下面是群组统计----------------------------
		obj.groups = groupInfo;
		//-----------------------我是华丽的分割线 下面是其他信息统计------------------------
		var _otherDesc = document.getElementById("_contact_other");
		if(_otherDesc){
			var _otherLength = _otherDesc.childNodes.length;
			for(var i=0;i<_otherLength;i++){
				var tempEl = _otherDesc.childNodes[i];
				if(tempEl.childNodes.length>0){
					var tmpText = tempEl.childNodes[0].innerText;
					if(tmpText ==="聊天工具"){
						obj.im = tempEl.childNodes[1].value;
					}else if(tmpText ==="网站"){
						obj.website = tempEl.childNodes[1].value;
					}else if(tmpText ==="地址"){
						obj.address = tempEl.childNodes[1].value;
					}else if(tmpText ==="SIP"){
						obj.sip = tempEl.childNodes[1].value;
					}
				}
			}
		}
		//验证信息
		obj.result = result;
		console.log(obj);
		return obj;
	},
	//新增更多的栏目
	createNewInfo = function(e){
		//stopPropagation(e)
		var tmpEl = document.getElementById("infoDesc");
		if(tmpEl){
			tmpEl.parentNode.removeChild(tmpEl);
		}
		var preantEl = document.getElementById("newMessage");
		var contentEl = document.createElement("div");
		contentEl.className = "subUl group";
		contentEl.style.display = "block";
		contentEl.id="infoDesc";
		var ulEl = document.createElement("ul");
		var length = otherItem.length;
		var otherText = "";
		if(length===0){
			otherText ="<li>无</li>";
		}else{
			for(var i=0;i<length;i++){
				otherText += "<li>" + otherItem[i] +"</li>";
			}
		}
		ulEl.innerHTML = otherText;
		
		var spanEl = document.createElement("span");
		contentEl.appendChild(spanEl);
		contentEl.appendChild(ulEl);
		preantEl.appendChild(contentEl);
		document.body.addEventListener('click', function(e){
			var tmpEl = document.getElementById("infoDesc");
			if(tmpEl && e.target.id != "newMessage"){
				tmpEl.parentNode.removeChild(tmpEl);
				return;
			}
		}, false)
		//其他栏目选择
		ulEl.addEventListener("click",function(e){
			stopPropagation(e)
			var type = e.srcElement.nodeName;
			var text = e.srcElement.innerText;
			if(type==="LI" && text!=="无"){
				var otherEl = document.getElementById("_contact_other");
				otherItem.remove(text);
				if(otherEl){
					var otherLi = document.createElement("li");
					otherLi.innerHTML = "<em>"+ text +"</em><input type='text'><b>-</b>"
					otherEl.appendChild(otherLi);
				}else{
					var mainEl = document.getElementById("contactMainBody");
					var otherUlEl = document.createElement("ul");
					otherUlEl.className = "company";
					otherUlEl.id = "_contact_other";
					otherUlEl.innerHTML = "<li><em>"+ text +"</em><input type='text'><b>-</b></li>"
					mainEl.insertBefore(otherUlEl,mainEl.lastChild);
				}
				if(document.getElementById("infoDesc")){
					var tmpEl = document.getElementById("infoDesc");
					tmpEl.parentNode.removeChild(tmpEl);
				}
				if(document.getElementById("contactTmpBg")){
					var tmpEl = document.getElementById("contactTmpBg");
					tmpEl.parentNode.removeChild(tmpEl);
				}				
			}
		}, false);		
		
	},
	emailNodeChoice = function(e){
		var target = e.target || e.srcElement;
		//var index = e.srcElement.parentNode.index();
		var element = e.srcElement.parentNode;
		switch(target.tagName){
			case "EM":
				appendEmailNode(element,e);
				break;
			case "B":
				appendEmailEl(element,e);
				break
			default:
				break;
		};
	},
	appendEmailNode = function(parent,e){
		var index = parent.index();
		mobileDescIndex = index;
		var el = createCoverDesc({
			parent: parent,
			index:index,
			body:"<li>公司邮箱</li><li>私人邮箱</li><li>其它</li>",
			type:"email",
			offset:40
		});	
		el.addEventListener("click",appendEmailDesc,false);
	},
	appendEmailDesc = function(e){
		var target = e.target || e.srcElement;
		console.log(e.srcElement.innerText);
		if(target.tagName === "LI"){
			var tmpTxt = e.srcElement.innerText;
			var appendEl = document.getElementById("_emailDesc");
			appendEl.childNodes.item(mobileDescIndex).firstChild.innerHTML = tmpTxt;
			//e.srcElement.parentNode.parentNode.parentNode.firstChild.innerHTML = tmpTxt;
			if(document.getElementById("contactDesc")){
				var tmpEl = document.getElementById("contactDesc");
				tmpEl.parentNode.removeChild(tmpEl);
			}
			if(document.getElementById("contactTmpBg")){
				var rowMain = document.getElementById("mainBody");
				var tmpEl = document.getElementById("contactTmpBg");
				rowMain.removeChild(tmpEl);
			}
		}
		mobileDescIndex = 0;
	},
	//获取元素的Y坐标
	pageY = function(elem) { 
		return elem.offsetParent?(elem.offsetTop+pageY(elem.offsetParent)):elem.offsetTop; 
	},
	appendEmailEl = function(parent,e){
		console.log(e);
		var index = parent.index();
		var type = e.srcElement.innerText;
		//查找最后一个文本框内容的长度
		var inputSize = parent.parentNode.lastChild.lastChild.previousElementSibling.value.length;
		console.log(mobielDescTop[0] + ":" + mobielDescTop[1])
		console.log(parent);
		if(type==="+"){
			if(inputSize>0){
				if(index>0){
					e.srcElement.innerText="-";
				}
				var parentEl = document.getElementById("_emailDesc");
				var liEl = document.createElement("li");
				liEl.innerHTML = "<em>公司邮箱</em><input type='text' value='' ><b>-</b>";
				parentEl.appendChild(liEl);
			}else{
				var index = parent.parentNode.lastChild.index();
				var last = parent.parentNode.lastChild;
				var topY = pageY(last)-29;
				console.log(topY);
				createCoverDesc({
					parent: parent,
					index:index,
					body:"<li>请输入电子邮箱！</li>",
					type:"email",
					offset:40,
					topY:topY
				});
						
			}
		}else if(type ==="-"){
			if(index > 0){
				var parentEl = e.srcElement.parentNode.parentNode;
				var currentEl = e.srcElement.parentNode;
				parentEl.removeChild(currentEl);
			}
		}
	},	
	mobileNodeChoice = function(e){
		var target = e.target || e.srcElement;
		//var index = e.srcElement.parentNode.index();
		var element = e.srcElement.parentNode;
		switch(target.tagName){
			case "EM":
				appendMobileNode(element);
				console.log(element,'element')
				break;
			case "B":
				appendMobileEl(element,e);
				break;
			default:
				break;
		};
	},
	appendMobileEl = function(parent,e){
		var index = parent.index();
		var type = e.srcElement.innerText;
		//查找最后一个文本框内容的长度
		var inputSize = parent.parentNode.lastChild.lastChild.previousElementSibling.value.length;
		if(type==="+"){
			if(inputSize>0){
				if(index>0){
					e.srcElement.innerText="-";
				}
				var parentEl = document.getElementById("_mobileDesc");
				var liEl = document.createElement("li");
				liEl.innerHTML = "<em>ivargo</em><input type='text' value='' placeholder='电话'><b>-</b>";
				parentEl.appendChild(liEl);
				mobielDescTop[0] = mobielDescTop[0]+40;
				mobielDescTop[1] = mobielDescTop[0]+40;	
			}else{
				var index = parent.parentNode.lastChild.index();
				createCoverDesc({
					parent: parent,
					index:index,
					body:"<li>请输入电话号码！</li>",
					type:"mobile"
				});
			}
		}else if(type ==="-"){
			if(index > 0){
				var parentEl = e.srcElement.parentNode.parentNode;
				var currentEl = e.srcElement.parentNode;
				parentEl.removeChild(currentEl);
				mobielDescTop[0] = mobielDescTop[0]-40;
				mobielDescTop[1] = mobielDescTop[1]-40;
			}
		}
	},
	//创建输入电话的遮盖层
	createCoverDesc = function(options){
		var parent = options.parent;
		console.log(options.parent,'options')
		var index = options.index
		var el = document.createElement("div");
		el.className = "subUl";
		el.id = "contactDesc";
		var ulEl = document.createElement("ul");
		ulEl.innerHTML = options.body;
		var spanEl = document.createElement("span");
		ulEl.appendChild(spanEl);
		el.appendChild(ulEl);
		
		var bgEl = document.createElement("div");
		bgEl.className = "popups_bg";
		bgEl.style.display = "block";
		bgEl.id = "contactTmpBg";
		bgEl.style.zIndex='-1';
		bgEl.style.background = "none";
		
		document.body.addEventListener("click",function(e){
			var target = e.target || e.srcElement;
			if(target.tagName !== "LI"){
				mobileDescIndex = 0;
				var parentEl = e.srcElement.parentNode;
				var target = e.target||e.srcElement;
				
				if(document.getElementById("contactDesc")){
					var tmpEl = document.getElementById("contactDesc");
					var parentEl = tmpEl.parentNode;
					parentEl.removeChild(tmpEl);
				}
				if(document.getElementById("contactTmpBg")){
					var rowMain = document.getElementById("mainBody");
					var tmpEl = document.getElementById("contactTmpBg");
					rowMain.removeChild(tmpEl);
				}
			}
		},true);
		var bgParentEl = document.getElementById("mainBody");
		bgParentEl.appendChild(bgEl);
		parent.appendChild(el)
		return el;
	
	},
	
	appendMobileNode = function(parent){
		var index = parent.index();
		mobileDescIndex = index;
		var el = createCoverDesc({
			parent: parent,
			index:index,
			body:"<li>ivargo</li><li>移动电话</li><li>住宅</li><li>单位</li><li>单位传真</li><li>住宅传真</li><li>其它</li>",
			type:"mobile"
			
		});
		el.addEventListener("click",appendMobileDesc,false);
		
	},
	appendMobileDesc = function(e){
		var target = e.target || e.srcElement;
		console.log(e.srcElement.innerText);
		if(target.tagName === "LI"){
			var tmpTxt = e.srcElement.innerText;
			var appendEl = document.getElementById("_mobileDesc");
			appendEl.childNodes.item(mobileDescIndex).firstChild.innerHTML = tmpTxt;
			//e.srcElement.parentNode.parentNode.parentNode.firstChild.innerHTML = tmpTxt;
			if(document.getElementById("contactDesc")){
				var tmpEl = document.getElementById("contactDesc");
				tmpEl.parentNode.removeChild(tmpEl);
				
			}
			if(document.getElementById("contactTmpBg")){
				var rowMain = document.getElementById("mainBody");
				var tmpEl = document.getElementById("contactTmpBg");
				rowMain.removeChild(tmpEl);
			}
		}
		mobileDescIndex = 0;
	},
	
	//个人信息添加到右边栏
	appendToRightElement = function(options){
		if(!document.getElementById("contactSelect")){
			removeRightElement();
			createSelectNode();
		}
		var el;
		el = document.getElementById("contactSelect");
		var titleEl;
		titleEl = el.getElementsByTagName("h4");
		titleEl[0].textContent = "当前选中" + selectIndex + "个联系人";
		
		var bodyEl;
		bodyEl = el.getElementsByTagName("ul")[0];
		var liEl;
		liEl = document.createElement("li");
		liEl.id = "del_" + options.contactId;
		
		var imgEl = document.createElement("img");
		imgEl.src = projectName +"/image/head_pic.jpg";
		var emEl = document.createElement("em");
		var textEl = document.createElement("p");
		textEl.innerHTML = options.bodyText;
		
		liEl.appendChild(imgEl);
		liEl.appendChild(emEl);
		liEl.appendChild(textEl);
		bodyEl.appendChild(liEl);
	},
	removeDelElement = function(options){
		if(document.getElementById("contactSelect")){
			var el = document.getElementById("contactSelect");
			var titleEl = el.getElementsByTagName("h4");
			titleEl[0].textContent = "当前选中" + selectIndex + "个联系人";
			var bodyEl = el.getElementsByTagName("ul")[0];
			var delEl = document.getElementById("del_" + options.contactId);
			bodyEl.removeChild(delEl);
		}
	},
	//全选
	selectAllContacts = function(){
		var els = document.getElementById("content").children;
		var length = els.length;
		for(var i = 0;i<length;i++){
			var tmpEl = els[i];
			if(tmpEl.className === "addresslist_name"){
				var id = tmpEl.id;
				var text = tmpEl.children[0].innerHTML;
				var tmpBtn = tmpEl.lastChild;
				if(tmpBtn.className===unSelectClass){
					selectIndex++;
					tmpBtn.className = SelectClass;
					tmpBtn.style.backgroundImage = "url(" + projectName + "/image/icon05.png)";
					appendToRightElement({
						contactId:id,
						bodyText:text
					});
					delContacts.push(id);
				}
			}
		}
	},
	cancelAllContacts = function(){
		var els = document.getElementById("content").children;
		var length = els.length;
		for(var i = 0;i<length;i++){
			var tmpEl = els[i];
			var tmpBtn;
			if(tmpEl.children[2]){
				tmpBtn = tmpEl.children[2];
			}else{
				tmpBtn = tmpEl.children[1];
			}
			if(tmpEl.className === "addresslist_name"){
				if(tmpBtn.className===SelectClass){
					tmpBtn.className = unSelectClass;
					tmpBtn.style.backgroundImage = "url(" + projectName + "/image/icon04.png)";
				}
			}
		}
		selectIndex=0;
		delContacts = [];
		createSelectEmptyNode();
	},
	createSelectNode = function(){
		var mainEl = document.createElement("div");
		mainEl.className = "contact_list";
		mainEl.id = "contactSelect";
		
		var titleEl = document.createElement("h4");
		
		mainEl.appendChild(titleEl);
		var listEl = document.createElement("ul");
		mainEl.appendChild(listEl);
		
		var emptyEl = document.createElement("div");
		mainEl.appendChild(emptyEl);
		
		var btnEl = document.createElement("div");
		btnEl.className = "btn_txt";
		
		var cancelBtn = document.createElement("button")
		var btnCancelText = document.createTextNode("取消");
		cancelBtn.appendChild(btnCancelText);
		cancelBtn.addEventListener("click",cancelAllContacts,false);
		

		var delBtn = document.createElement("button")
		//var btnCancelText = document.createTextNode("取消");
		var delImg = document.createElement("img");
		delImg.src = projectName + "/image/message_delete.png";
		delBtn.appendChild(delImg);
		//事件添加
		delBtn.addEventListener("click", createDeleteCover, false);
		
		var groupBtn = document.createElement("button");
		groupBtn.id = 'changeGroup';
		groupBtn.className = 'changeGroup'
		var btnCancelText = document.createTextNode("群组");
		
		groupBtn.appendChild(btnCancelText);
		groupBtn.addEventListener("click",_showChangeGroup,false);
		
		//事件添加
		btnEl.appendChild(cancelBtn);
		btnEl.appendChild(groupBtn);
		btnEl.appendChild(delBtn);
		
		//mainEl.appendChild(btnEl);
		var parentElement= document.getElementById("rightElement");
		parentElement.appendChild(mainEl);
		parentElement.appendChild(btnEl);
		
		//群组列表以及点击功能
		function _showChangeGroup(e){
			stopPropagation(e);
			main().baseModule.simpleSend({
				url:main().baseModule.projectPath() +"/contact/group",
				method:"GET",
				callback:function(obj){
					var innerBody = "";
					if(obj.length>0){
						var length = obj.length;
						for(var i=0;i<length;i++){
							innerBody += "<li id='" + obj[i].groupId + "'>" +  obj[i].groupName + "</li>";
						}
					}
					innerBody += "<li>新建群组</li>";
					var groupEl = document.createElement("div");
					var ulEl = document.createElement("ul");
					ulEl.innerHTML = innerBody;

					var bg = document.createElement("div");
					bg.id = "bodyCover";
					bg.className = "popups_bg";
					bg.style.display = "block";
					bg.style.background = "none";
					bg.style.zIndex = 0;
					var changeGroup = document.getElementById("changeGroup");
					changeGroup.appendChild(ulEl);
					var span = document.createElement('span');
					changeGroup.appendChild(span)		
					document.body.addEventListener("click",function(e){
						var changeGroup = document.getElementById("changeGroup");
						var changeGroup_ul = changeGroup.childNodes[1];
						var changeGroup_span = changeGroup.childNodes[2];
						if(changeGroup_ul && changeGroup_span){
							changeGroup.removeChild(changeGroup_ul);
							changeGroup.removeChild(changeGroup_span);
							return;
						}
					}, false);
					ulEl.addEventListener("click",exchangeOrCreateGroup,false);					
				}
			});
		};
		function exchangeOrCreateGroup(e){
			var srcEl = e.srcElement;
			if(srcEl.innerText === "新建群组"){
				showCreateGroup();
			}else{
				if(srcEl.tagName === "LI"){
					removeCover();	
					createLodingCover("mainBody");
					var ids = delContacts.join(",");
					//console.log(groupId +":" + groupText);
					main().baseModule.simpleSend({
						url:main().baseModule.projectPath() +"/contact/movetoContactGroup",
						method:"POST",
						data:{contactsids:ids,groupids:srcEl.id,vargoId:vargoId},
						callback:function(obj){
//							console.log(obj);
							if(obj.code==="0"){
								location.reload();
							}
						}
					})
				}
			}
		}
	},
	removeCover = function (){		
		var delBg = document.getElementById("bgCover");
		var delnr = document.getElementById("bodyCover");
		if(delBg && delnr){
			var bgParent = delBg.parentNode;
			var nrParent = delnr.parentNode;
			bgParent.removeChild(delBg);
			nrParent.removeChild(delnr);
		}
	},
	//显示群组添加遮盖层以及提交添加
	showCreateGroup = function(){
		var creat_group = $('#creat_group');
		showPopWin(creat_group);
		var creatInput = creat_group.find('input');
		creatInput.val('');
		var btns = creat_group.find('button');
		var confirmBtn = btns.eq(0);
		confirmBtn.on("click",_createGroup);		
		var cancelBtn = btns.eq(1);
		cancelBtn.on("click",_removeGroupCover);

		function _removeGroupCover(){
			hidePopWin(creat_group);
		};
		function _createGroup(e){
			var text = this.parentNode.getElementsByTagName('input')[0].value;
			if(text.trim().length>1){
				$('.err-tip').text("");
				main().baseModule.simpleSend({
					url:main().baseModule.projectPath() +"/contact/addGroup",
					data:{vargoId:vargoId,groupName:text},
					method:"POST",
					callback:function(obj){
						if(obj.code==="0"){
							hidePopWin(creat_group)
						}
					}
				});
			}else{
				$('.err-tip').text("请填写正确的群组名称");
			}
		
		}
	},
	createSelectEmptyNode = function(){
		removeRightElement();
		var element = document.getElementById("rightElement");
		var emptyElement = document.createElement("div");
		emptyElement.className = "emptySelectNode";
		emptyElement.innerHTML = "点击联系人查看详情";
		element.appendChild(emptyElement);
	},
	removeRightElement = function(){
		removeCover();
		var element = document.getElementById("rightElement");
		var childs = element.childNodes;
		var length = childs.length;
		for(var i = length-1;i>=0;i--){
			element.removeChild(childs.item(i));
		}
	},
	createDeleteCover = function(options){
		var bg = document.createElement("div");
		bg.id = "bgCover";
		bg.className = "popups_bg";
		bg.style.display = "block";
		bg.addEventListener("click",_removeCover,false);
		var nr = document.createElement("div");
		nr.id = "nrCover";
		nr.className= "popups_nr";
		var body = document.createElement("div");
		body.className = "locking";
		body.innerHTML = "<h3>删除联系人</h3><p style='text-align:center;'>删除选中联系人？</p>"
		
		var cancelBtn = main().baseModule.createFormFeild({
			type:"button",
			text:"取消",
			className: "cancelbtn",
			eventMethod:_removeCover
		});
		var cancelDiv = document.createElement("div");
		cancelDiv.className = "lockingBtn"
		var confirmBtn = main().baseModule.createFormFeild({
			type:"button",
			text:"确定",
			className: "surebtn",
			eventMethod:_deleteContacts
		});
		var sureDiv = document.createElement("div");
		sureDiv.className = "lockingBtn" 
		cancelDiv.appendChild(cancelBtn.getElement());
		sureDiv.appendChild(confirmBtn.getElement());
		body.appendChild(cancelDiv);
		body.appendChild(sureDiv);
		
		nr.appendChild(body);
		var parent = document.getElementById("mainBody");
		parent.appendChild(bg);
		parent.appendChild(nr);

		function _deleteContacts(){
			//console.log(delContacts);
			_removeCover();
			createLodingCover("mainBody");
			var ids = delContacts.join("|");
			main().baseModule.simpleSend({
				url:main().baseModule.projectPath() +"/contact/delete",
				data:{contactsids:ids,vargoId:vargoId},
				method:"POST",
				callback:function(obj){
					location.reload();
				}
			});
		}
		function _removeCover(){
			var delBg = document.getElementById("bgCover");
			var delnr = document.getElementById("nrCover");
			var parent = delBg.parentNode;
			parent.removeChild(delBg);
			parent.removeChild(delnr);
		};
	},
	
	//创建遮盖层
	createLodingCover = function(option){
		var nrCover = document.createElement("div"),
		bodyCover = document.createElement("div"),
		bgCover = document.createElement("div");
		bgCover.className = "popups_bg";
		bgCover.id = "coverBg";		
		nrCover.className = "loading";
		bodyCover.className = "line-spin-fade-loader";
		nrCover.id = "lodingCover";
		for(var i = 0;i<8;i++){
			var temp = document.createElement("div");
			bodyCover.appendChild(temp);
		}
		nrCover.appendChild(bodyCover);
		
		document.getElementById(option||"mainBody").appendChild(nrCover);
		document.getElementById(option||"mainBody").appendChild(bgCover);
	},
	removeLodingCover = function(){
		var tempCover = document.getElementById("lodingCover");
		var bgCover = document.getElementById("coverBg");
		var tempBody = tempCover.parentNode;
		tempBody.removeChild(tempCover);
		tempBody.removeChild(bgCover);
	},
	showImport = function(){
		removeRightElement();
		var bodyEl = document.createElement("div");
		bodyEl.className = "import";
		bodyEl.style.display = "block";
		var innerBody = "<h4>导出联系人</h4><p>我们支持导入来自智能手机导出的vCard文件(*.vcf)。注意：由于各个厂商的联系人格式不完全相同，所以在导入过程中可能会遗漏部分信息。</p>";
		innerBody += "<a href='javascript:void(0);'><input type='file' value='选择文件' onchange='checkVCF(this)' id='importCvfFile' name='importCvfFile'>选择文件</a>";
		innerBody += "<b></b>";
		bodyEl.innerHTML = innerBody;
		
		var btnEl = document.createElement("div");
		btnEl.style.display = "none";
		btnEl.style.textAlign = "center";
		btnEl.style.color = "#f00";
		btnEl.innerHTML = "<em></em><br><br>";
		btnEl.id = "goforImport";
		var btn = document.createElement("button");
		btn.innerHTML = "确认导入";
		btnEl.appendChild(btn);
		bodyEl.appendChild(btnEl);
		document.getElementById("rightElement").appendChild(bodyEl);
		btn.addEventListener("click",importVcfContact,false);
	},
	showExport = function(){
		removeRightElement();
		var bodyEl = document.createElement("div");
		bodyEl.className = "export";
		bodyEl.style.display = "block";
		var innerBody = "<h4>导出联系人</h4><p>你可以把整个通讯录导出为vCard格式，以方便在其他设备服务上导入使用。或导出excel格式，方便自己浏览查看。</p>";
		bodyEl.innerHTML = innerBody;
		var vcfBtn = document.createElement("button");
		vcfBtn.id="exportConfirm";
		vcfBtn.innerHTML = "vCard导出";
		vcfBtn.addEventListener("click",function(){
			location.href = projectName + "/contact/exportContactVcf";
		},false);
		
		var excelBtn = document.createElement("button");
//		excel.id="exportConfirm"；
		excelBtn.innerHTML = "excel导出";
		excelBtn.addEventListener("click",function(){
			location.href = projectName + "/contact/exportContactsByExcel";
		},false);
		
		bodyEl.appendChild(vcfBtn);
		bodyEl.appendChild(excelBtn);
		document.getElementById("rightElement").appendChild(bodyEl);

	},
	groupList = function(e){
		stopPropagation(e);
		main().baseModule.simpleSend({
			url:main().baseModule.projectPath() +"/contact/group",
			method:"GET",
			callback:groupCallBack
		});
		function groupCallBack(obj){
			var allpeople = document.getElementById('allpeople');
			if(allpeople){
				allpeople.parentNode.removeChild(allpeople)
			}
			var innerBody = "";
			if(obj.length>0){
				var ulEl = document.createElement("ul");
				ulEl.className = 'allpeople';
				ulEl.id = 'allpeople'
				var length = obj.length;
				var innerBody = "";
				for(var i =0;i<length;i++){
					innerBody += "<li id='" + obj[i].groupId + "'><em>" +  obj[i].groupName + "</em><i class='lsf symbol'>delete</i></li>"
				}
				ulEl.innerHTML = innerBody;
				ulEl.addEventListener("click",groupOpreate,false);
				document.getElementById("totalContacts").getElementsByTagName('div')[0].appendChild(ulEl);							
			}
		}
		function groupOpreate(e){
			var type = e.srcElement.nodeName;
			switch(type){
				case "I":
					var id = e.srcElement.parentNode.id;
					deleteGroup(id,e);
					break;
				default:
					break;
			}
			console.log(e);
		}
		function deleteGroup(id,e){
			stopPropagation(e);
			main().baseModule.simpleSend({
				url:main().baseModule.projectPath() +"/contact/groupDelete",
				method:"GET",
				data:{vargoId:vargoId,groupId:id},
				callback:function(obj){
					groupList();
				}
			});
		}
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

	return{
		queryTotalList:function(options){
			vargoId = options.vargoId;
			//console.log(options.datas);
			//如果没有记录的处理逻辑
			var totalLength = options.datas.length
			//没有数据时候的处理逻辑
			if(totalLength == 0){
				
			}else{
				//右侧列表清空
				createSelectEmptyNode();
				var target = filterCharToPingyin(options.datas);
				var defaultElement;
				var parentElement = document.getElementById(options.parentId);
				if(target.isDefault){
					var defaultElement = document.createElement("li");
					defaultElement.className = "addresslist_classify";
					defaultElement.id = "default_contact";
					defaultElement.innerHTML = "#";
					parentElement.appendChild(defaultElement);
				}
				//添加标题
				if(target.initials){
					var length = target.initials.length;
					if(length > 0){
						for(var i=0;i<length;i++){
							var element = document.createElement("li");
							element.className = "addresslist_classify";
							element.id = "contact_" + target.initials[i];
							element.innerHTML = target.initials[i];
							parentElement.appendChild(element);
						}
					}
				}
				var subElementLength = options.datas.rows.length;
				var totalContacts = document.getElementById("totalContacts");
				totalContacts.children[0].innerHTML = "所有联系人<i>(" + subElementLength +")</i><b></b>";
				//绑定列表中群组的事件
				totalContacts.children[0].addEventListener("click",groupList,false);
				//数据逐个添加
				for(var i=0;i<subElementLength;i++){
					var fullName = options.datas.rows[i].fullName;
					var contactId = options.datas.rows[i].contactId
					var initial = makePy(fullName)[0].toUpperCase();
					initial = initial.charAt(0);
					var parent; 
					if(charMatch.test(initial)){
						parent = document.getElementById("contact_" + initial);
					}else{
						parent = document.getElementById("default_contact");
					}
					var mainElement = document.createElement("li");
					mainElement.className = "addresslist_name";
					mainElement.id = contactId;
					
					var bodyElement = document.createElement("em");
					bodyElement.innerHTML = fullName;
					
					var buttonElement = document.createElement("button");
					//buttonElement.id = "btn_" + contactId;
					buttonElement.className = unSelectClass;
					
					mainElement.appendChild(bodyElement);
					if(options.datas.rows[i].groupNames){
						var groupEl = document.createElement("span");
						groupEl.innerHTML = options.datas.rows[i].groupNames;
						mainElement.appendChild(groupEl);
					}
					mainElement.appendChild(buttonElement);
					//绑定统一事件处理
					mainElement.onmouseover = contactListHandle;
					mainElement.onmouseout = contactListHandle;
					mainElement.onclick = contactListHandle;
					
					insertAfter(mainElement,parent);
				}
			}
		},
		selectAllContact:function(){
			selectAllContacts();
		},
		createContact:function(){
			createOrUpdate({});
		},
		loadingCover:function(){
			createLodingCover();
		},
		showImportExport:function(e){
			var bodyCover = document.getElementById('bodyCover');
			var btns = bodyCover.getElementsByTagName('button');
			if(e.target.id == 'importExport'){
				if(bodyCover.style.display == 'none'){
					bodyCover.style.display = 'block';
				}else{
					bodyCover.style.display = 'none';
				}
			}else if(e.target == btns[0]){
				showImport();
			}else{
				showExport();
			}
			
			
		}
	}
	
}());

module.exports = contactModule;



