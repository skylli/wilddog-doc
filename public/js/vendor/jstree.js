var jsTree=function(el,host,path,opt){
	var root=Wio("http://"+host+path,opt);
	var key=root.key();
	if(key==""){
		key=host;
	}
  //auth
	var inited=false;

  if(root.getAuth()==null){
	  root.onAuth(function(){

		  root.once('value',function(snapshot){
			  	var s=$(el).find("ul:first")[0];
			  	build(s,path,key,snapshot);
			  	resize();
		  });  
	  });
	  if(opt&&opt.adminToken){
		  root.authWithCustomToken(opt.adminToken);
	  }
	  else{
		  //
		  root.once('value',function(snapshot){
		  	var s=$(el).find("ul:first")[0];
		  	build(s,path,key,snapshot);
		  	resize();
		});  
	  }
  }
  else{
	  root.once('value',function(snapshot){
		  	var s=$(el).find("ul:first")[0];
		  	build(s,path,key,snapshot);
		  	resize();
	  });  
  }





$("li.jstree-open>div>ins.jstree-icon").click(function(){

	$(this).parents("li:first").removeClass("jstree-open").addClass("jstree-closed");
});
$("li.jstree-closed>div>ins.jstree-icon").click(function(){
	$(this).parents("li:first").removeClass("jstree-closed").addClass("jstree-open");
});
function isEmpty(obj)
{
    for (var name in obj) 
    {
        return false;
    }
    return true;
};
function buildData(ele){
	var res={};
	var key=ele.find("span.tree-content:first input.nameInput:first").val();
	var value=ele.find("span.tree-content:first input.valueInput:first").val();
	if(value[0]=="\""&&value[value.length-1]=="\""){
		value=JSON.parse(value);
	}

	if(key==null ||key==""){
		return res
	}
	var childList=ele.find("ul:first>li");
	if(childList!=null&&childList.length>0){
		var childObj={};
		for(var i=0;i<childList.length;i++){
			var childItem=buildData($(childList[i]));
			for (k in childItem){
				if(childItem.hasOwnProperty(k)){
					if(typeof childItem[k]=='object'){
						if(!isEmpty(childItem[k])){
							childObj[k]=childItem[k];
						}
					}
					else {
						childObj[k]=childItem[k];
					}
				}
			}

		}
		if(!isEmpty(childObj))
			res[key]=childObj;
	}
	else if(value!=null ){
		res[key]=value;
	}
	return res;
}

var elementMap={};
var newEmement=null;
var editing=false;
var editingPath;


function newConfirm(){
	var tmp=$('<li class="confirm"><ins>&nbsp;</ins><a href="#" class="spriteBtn cancelBtn" id="cancelBtn"></a><a href="#" class="spriteBtn confirmBtn" id="confirmBtn"></a></li>');
	var onConfirm=function(){
		var obj=buildData(newEmement);
		editing=false;
		newEmement.remove();
		tmp.remove();

		var client=Wio('http://'+host+editingPath);

		for(k in obj){
			if(!obj.hasOwnProperty(k))
				continue;
			if(obj[k]!=null&&!isEmpty(obj[k]))
				client.child(k).set(obj[k]);
		}

	}
	var onCancel=function(){
		editing=false;
		newEmement.remove();
		tmp.remove();
	};
	tmp.on('click','.confirmBtn',function(){
		onConfirm();

	});

	tmp.on('click','.cancelBtn',function(){
		onCancel();
	});
	newEmement.on("click","div:first a.removeBtn",function(){
		onCancel();
	});

	return tmp;
}

function resize(){
	var input=$("input.valueedit").attr("size",10);
}

function newLeafEdit(parent){
	var listSize=0;

	var tmp=$('<li class="jstree-leaf adding" ><div><ins class="jstree-icon">&nbsp;</ins><span class="tree-content"><span><span class="nameLabel">name:</span><input type="text" class="nameInput" placeholder="Name"><span><span class="valueLabel">value:</span><input type="text" class="valueInput" placeholder="Value"></span></span><a href="#" class="spriteBtn addBtn">&nbsp;</a><a href="#" class="spriteBtn removeBtn">&nbsp;</a></span></div></li>');

	tmp.on('click','ul:first>li>div .removeBtn',function(){
		$(this).parents("li:first").remove();
		listSize-=1;
		if(listSize==0){
			tmp.remove("ul:first");
			tmp.find("input.valueInput:first").parent().css("display","inline");
		}

	});
	tmp.on('click','div:first .addBtn',function(){
		var newEdit=newLeafEdit(tmp);
		if(listSize==0){
			tmp.append("<ul></ul>");
			tmp.find("input.valueInput:first").parent().css("display","none");
		}
		tmp.find('ul:first').append(newEdit);
		listSize+=1;

	});
	return tmp;
}
function fromInput(v){
	try{
		return JSON.parse(v);
	}
	catch(e){
		return v;
	}

}
function toInput(v){
	var v=JSON.stringify(v).replace(/\"/g,"&quot;");
	return v;	
}
function newLeaf(path,name,value){

	var v=toInput(value);
	var tmp=$('<li class="jstree-leaf" ><div><ins class="jstree-icon">&nbsp;</ins><span class="tree-content added"><span><a class="name" href="{path}">{name}</a><span class="valueContainer">: <input type="text" class="valueedit"  value="{value}" disabled="disabled"></span></span></span></div></li>'.replace("{path}",path).replace("{value}",v).replace("{name}",name));
	var client=Wio('http://'+host+path);
	client.on('value',function(snapshot){
		if(snapshot.val()!=null){
			tmp.find("input.valueedit:first").val(JSON.stringify(snapshot.val()));
		}
		else{
			client.destroy();
			//tmp.remove();
		}	

	});
	
	client.on('childChanged',function(snapshot){
		console.log("changed",snapshot);
		tmp.find("input.valueedit:first").val(JSON.stringify(snapshot.val()));

		tmp.find(".tree-content:first").addClass('changed');
		setTimeout(function(){
			tmp.find(".tree-content:first").removeClass('changed');
		},1500);


	})

	tmp.find("span.tree-content").hover(
		function(){
			if(editing){
				return;
			}
			$(this).addClass("tree-content-hover");
			$(this).append('<a href="#" class="spriteBtn removeBtn"/>');
			$(this).find("input.valueedit:first").addClass("valueedit-hover").removeAttr("disabled");

			$(this).find("input.valueedit:first").focusout(function(){
				if(editing){
				}
				else{
					$(this).attr("disabled","disabled");	
				}

			});	

		},
		function(){
			var _this=this;
			if(editing){
				$(document).one('click',function(){
					$(_this).removeClass("tree-content-hover");
					$(_this).find("a.removeBtn").remove();
					$(_this).find("input.valueedit:first").attr("disabled","disabled");
					editing=false;
					client.once('value',function (snapshot){
						$(_this).find("input.valueedit:first").val(JSON.stringify(snapshot.val()));
					});

				});

				return;
			}
			
			$(this).removeClass("tree-content-hover");
			$(this).find("a.removeBtn").remove();
			$(this).find("input.valueedit").attr("disabled","disabled");	

						
		//TODO sync data;
		}

	);
	tmp.find("input.valueedit:first").focus(function(){
			var _this=tmp;
			editing=true;

	});
	tmp.find("input.valueedit:first").on('keypress', function(e) {
		var _this=tmp;
		if(e.keyCode==13&&editing){
			var v=$(_this).find("input.valueedit:first").val();
			$(_this).removeClass("tree-content-hover");
			$(_this).find("a.removeBtn").remove();
			$(_this).find("input.valueedit").attr("disabled","disabled");
			editing=false;
			client.set(fromInput(v));		

		}

	});
	tmp.on('click','div:first .removeBtn',function(){
		client.remove();
	});
	elementMap[path]=tmp;
	setTimeout(function(){
		tmp.find(".added:first").removeClass("added");
	},"1500");
	return tmp;
}
function newNode(path,name){
	//build html
	var tmp= $('<li class="jstree-open" ><div><ins class="jstree-icon">&nbsp;</ins><span class="tree-content added"><span><a class="name" href="{path}">{name}</a><span class="valueContainer"></span></span></span></div><ul></ul></li>'.replace('{path}',path).replace('{name}',name));

	//click the  "+" or "-" to control the tree
	tmp.find("ins").click(function(){
		clazz=$(tmp).attr("class");
		if(clazz=="jstree-open"){
			(tmp).attr("class","jstree-closed");
		}
		else{
			$(tmp).attr("class","jstree-open");	
		}

	});
	//when your mouse moved in the node ,buttons will show up
	tmp.find("span.tree-content").hover(function(){
		if(editing){
			return;
		}
		$(this).addClass("tree-content-hover");
		$(this).append('<a href="#" class="spriteBtn addBtn"/>');
		$(this).append('<a href="#" class="spriteBtn removeBtn"/>');
	},
	function(){
		if(editing){
			return;
		}
		$(this).removeClass("tree-content-hover");
		$(this).find("a.addBtn").remove();
		$(this).find("a.removeBtn").remove();
	});
	//bind event



	var client=Wio('http://'+host+path);
	tmp.on('click','div:first .removeBtn',function(){
		client.remove();
	});
	tmp.on('click','div:first .addBtn',function(){

		var newEdit=newLeafEdit();
		newEmement=newEdit;
		tmp.find("span.tree-content a.addBtn").remove();
		tmp.find("span.tree-content a.removeBtn").remove();
		tmp.find("span.tree-content").removeClass("tree-content-hover");
		tmp.find('ul:first').prepend(new newConfirm);
		tmp.find('ul:first').prepend(newEdit);

		editing=true;
		editingPath=path;
	});

	client.on('childAdded',function(snapshot){

		snapshot.forEach(function(k,value){
			var childpath=null;
			if(path=='/'){
				childpath="/"+k;
			}
			else{
				childpath=path+"/"+k;
			}

			build(tmp.find("ul:first"),childpath,k,snapshot.child(k));
		});

		tmp.find(".tree-content:first").addClass('changed');
		setTimeout(function(){
			tmp.find(".tree-content:first").removeClass('changed');
		},1500);

	});

	
	client.on('childChanged',function(snapshot){
		if(snapshot.val()==null){
			//this is a remove event
			return;
		}
		elementMap[snapshot.path].find(".tree-content:first").addClass('changed');
		setTimeout(function(){
			elementMap[snapshot.path].find(".tree-content:first").removeClass('changed');
		},1500);

	});

	client.on("childRemoved",function(snapshot){
		snapshot.forEach(function(k,v){
			var childpath=null;
			if(path=='/'){
				childpath="/"+k;
			}
			else{
				childpath=path+"/"+k;
			}
			elementMap[childpath].find(".tree-content:first").removeClass("changed");
			elementMap[childpath].find(".tree-content:first").addClass("removed");
			setTimeout(function(){
				elementMap[childpath].remove();
				delete  elementMap[childpath];
			},1500);



			client.child(k).destroy();	

		});
		tmp.find(".tree-content:first").addClass('changed');
		setTimeout(function(){
			tmp.find(".tree-content:first").removeClass('changed');
		},1500);
	});
	elementMap[path]=tmp;
	setTimeout(function(){
	tmp.find(".added:first").removeClass("added");
	},1500);

	return tmp;
}

function build(ele,path,key,snapshot){
	var tmp=null;
	if(snapshot.type()=='object'){
		var currentEle=$(newNode(path,key));
		if(path=='/'){//root
			$(currentEle).find("ins.jstree-icon").remove();
		}
		$(currentEle).appendTo($(ele));
		var keys=snapshot.keys();
		for(var i=0;i<keys.length;i++){
			var k=keys[i];
			if(path=="/"){
				var newPath='/'+k;
			}
			else{
				var newPath=path+'/'+k;
				
			}

			build($(currentEle).find(" ul:first")[0],newPath,k,snapshot.child(k));

		}
		
	}		
	else {
		var currentEle=$(newLeaf(path,key,snapshot.val()));
		$(currentEle).appendTo($(ele));
	}
	}

}
