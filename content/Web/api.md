/*
Title: javascript API
Sort: 2
*/

# Wilddog

## Wilddog(wilddogUrl)
初始化一个Wilddog客户端
输入一个包含应用ID 和路径的url,初始化一个 Wildog 客户端

#### params

* wilddogUrl `string`
 关注节点url,Wilddog 中任何数据都能够通过一个url来进行访问


#### return
* Wilddog 对象引用

```js

ref=Wilddog("http://weather-control.wilddog.com/city/Beijing");
//yeah,lets do something really bad

```

----

## authWithCustomToken(token,callback)
使用一个合法的token进行登录

#### params
* token `string`
	已有的合法token
* callback `function(err,auth)` 
  如果操作成功`err` 为null,如果不成功 `err` 是一个包含 `code` 的对象 ,如果`err==null` auth为包含用户授权信息的   对象
  

----


## authWithPassword(credentials,callback)
通过邮箱密码授权


#### params

* credentials `object`
包含用户授权信息的数据,通常包含`email` `password` 
(eg.`{"email":<email>,"password":<password>}`)


* callback `function(err,auth)` 
  如果操作成功`err` 为null,如果不成功 `err` 是一个包含 `code` 的对象 ,如果`err==null` auth为包含用户授权信息的对象

```js
ref.authWithPassword({email:"Loki@asgard.com",password:"asshole"},
		function(err,auth){
			if(err==null){
				//auth success
				console.log(auth)
			}
			else{
				//lets take care of err
				console.log(err)
			}
});
```
----

## authWithOAuthRedirect(provider,callback);
通过OAuth跳转流程授权
调用`authWithOAuthPopup` ,页面跳转到 OAuth授权也,用户在页面进行授权操作,此过程中的任何数据都不会经过第三方 (包括WILDDOG 服务),而且全部采用https 访问,因此安全可靠.当授权结束页面跳转回最初页面,授权结束


#### params
* provider `string`  
e.g.`"weibo"` (目前支持微博平台).oauth服务的提供平台,目前支持的平台有 `weibo` `wechat`
* callback `function(err,auth)`
  如果授权失败err 为代表错误的对象 ,因为页面跳转,callback永远不会被执行.

```js

ref.authWithOAuthRedirect(provider,function(err,auth){
	//can never be here	
})

```

----


## authWithOAuthPopup(provider,callback);
通过oauth弹框流程授权
调用`authWithOAuthPopup` ,页面将弹出OAuth授权页,用户在页面进行授权操作,此过程中的任何数据都不会经过第三方 (包括WILDDOG 服务),而且全部采用https 访问,因此安全可靠.当授权结束后弹框页自动关闭,wilddog 客户端授权完毕.

#### params
* provider `string`  e.g.`"weibo"` (目前支持微博平台)
 oauth服务的提供平台,目前支持的平台有 `weibo` `wechat`
 
* callback `function(err,auth)`
  如果授权失败err 为代表错误的对象

```js
ref.authWithOAuthPopup(provider,function(err,auth){
	if(err!=null){
		//something unexpected happend
	}
	else{
		console.log(auth);
	}
	
})

```

----

## createUser(credentials,callback)
通过邮箱注册用户
通过`createUser` 注册的终端用户会托管在`WILDDOG` 平台, 被注册的用户可以采用 `authWithPassword` 授权.

#### params
* credentials `object`
包含用户认证信息的数据,通常包含`email` `password` 
(eg.`{"email":<email>,"password":<password>}`)

* callback `function(err,data)`
如果操作成功`err` 为null,如果不成功 `err` 是一个包含 `code` 的对象 ,如果`err==null` data为包含用`id` ,`provider` 的 `object`


```js
ref.createUser({email:"Loki@asgard.com",password:"asshole"},
		function(err,data){
			if(err!=null){
				//not success
			}
			else{
				//create user success
			}
});
```

----

## changePassword(email,oldPassword,newPassword,callback)
修改用户密码
`WILDDOG` 平台托管的用户可以通过`changePassword` 修改密码

#### params
* email `string`
  用户邮箱
* oldPassword `string`
  旧密码
* newPassword `string`
  新密码
* callback `function(err,data)`
 如果操作成功`err` 为null,如果不成功 `err` 是一个包含 `code` 的对象 ,如果`err==null` data为包含用`id` ,`provider` 的 `object`


----

## changeEmail(oldEmail,newEmail,password,callback)
修改登录邮箱
`WILDDOG` 平台托管的用户可以通过`changeEmail` 修改登录邮箱

#### params
* oldEmail `string`
* newEmail `string`
* password 	`string`
* callback `function(err)`

----

## removeUser(email,password,callback)
删除帐号
`WILDDOG` 平台托管的用户可以通过`removeUser` 删除帐号
#### params

* email `string`
* password 	`string`	
* callback `fucntion(err,callback)`


-----

## resetPassword(email,callback)
重置密码
`WILDDOG` 平台托管的用户可以通过`resetPassword` 重置密码

#### param
* email `string`
* callback `function(err,callback)`




-----

## child(key)
返回当前节点的子节点的引用

#### params
* key 子节点名,可以是相对当前节点的路径.

#### return
* 子节点的引用



```js

var ref=Wilddog("https://weather-control.wilddogio.com/city");
//ref refer to node weather-control.wilddogio.com/city
child_ref=ref.child('Beijing');
//now child_ref refer to "weather-control.wilddogio.com/city/Beijing"

```

----

## parent()
#### return
* 父节点的ref

```js
//return the refer to the father node of current
var parent_ref=ref.parent();
```

----

## key()
获取当前节点的key
#### return
* 当前节点的key


```js
var ref=Wilddog("https://weather-control.wilddog.com/city/Beijing");
//return the key to current node
var key=ref.key();
//key is 'Bejing'

```
----

## url()
获取当前节点的url

#### return
* 当前节点的url



----

## set(value,[oncomplete])
设置一个节点的值.并且同步到云端
如果`value != null` ,当前数据会被value覆盖.如果中间路径不存在,WILDDOG 会自动将中间路径补全.如果`value == null`,删除当前节点,效果等同于 remove


#### params

* value `object|string|number|boolean|null`
 value 可以是对象,字符串,数字,null.当value 不为null,设置当前节点的值为value
 <br/>
* onComplete `function(err)` 
如果操作成功 `err==null` 否则,err为包含code的`object`  如果`code==1201`,此用户无权限访问当前节点,出现这种情况可能是因为没有进行授权,或者授权的用户无访问权限

```js
var ref=Wilddog("https://weather-control.wilddogio.com/city/Beijing");
//the initial value is {"temp":23,"humidity":30,"wind":2}

ref.set({"temp":10,"pm2.5":500});
//the expected value of https://weather-control.wilddogio.com/city/Beijing should be {"temp":10,"pm2.5":500}
```

----

## update(value,[onComplete])
更新一个节点的值
与`set`操作不同,`update` 不会直接覆盖原来的节点,而是将`value` 中的所有子节点插入到原来的节点中,如果原来的节点中已经有同名子节点,则覆盖原有的子节点
e.g. update之前 `{"l1":"on","l3":"off"}` ,`value={"l1":"off","l2":"on"}` update 后期望的数据是 `{"l1":"off","l2":"on","l3":"off"}`


#### params
* value `object`
包含子节点对象的集合

* onComplete `function(err)` 
如果操作成功 `err==null` 否则,err为包含code的`object`  如果`code==1201`,此用户无权限访问当前节点,出现这种情况可能是因为没有进行授权,或者授权的用户无访问权限

```js
var ref=Wilddog("https://weather-control.wilddogio.com/city/Beijing");
//the initial value is {"temp":23,"humidity":30,"wind":2}

ref.update({"temp":10,"pm2.5":500});
//the expected value of https://weather-control.wilddogio.com/city/Beijing should be {"temp":10,"pm2.5":500,"humidity":30,"wind":2}

```



## remove([onComplete])
删除一个节点,效果等同于 `set(null,[onComplete])`,
如果父级节点只有当前节点一个子节点, 会递归删除父级节点

#### params

* * onComplete `function(err)` 
如果操作成功 `err==null` 否则,err为包含code的`object`  如果`code==1201`,此用户无权限访问当前节点,出现这种情况可能是因为没有进行授权,或者授权的用户无访问权限


``` js
//the initial value of https://weather-control.wilddogio.com is 
//{"city":{"Beijing":{"temp":23,"humidity":30,"wind":2}}}
var ref=Wilddog("https://weather-control.wilddogio.com/city/Beijing");
ref.remove()

// value of https://weather-control.wilddogio.com is {}

```
----

## push(value,[oncomplete])
在当前节点下新增一个节点,节点的`key` 自动生成,节点的数据是传入的参数 value

#### params
* value `object|string|number|boolean`
用户希望在当前节点下新增的数据.

* onComplete `function(err)` 
如果操作成功 `err==null` 否则,err为包含code的`object`  如果`code==1201`,此用户无权限访问当前节点,出现这种情况可能是因为没有进行授权,或者授权的用户无访问权限

#### return
* 新插入子节点的引用


```js

var ref=Wilddog("https://weather-control.wilddogio.com/users")
var childref=ref.push({"name":"Thor","planet":"Asgard"});
var newKey=childref.key();
//newKey shoud look like a base64-like series eg -JmRhjbYk73IFRZ7
var url=newKey.url()
//url shoud be https://weather-control.wilddogio.com/users/-JmRhjbYk73IFRZ7


```
--------

## on(type,callback)
监听某个事件,注册回调函数.
#### params

* type

|事件|说明|
 |----|----|
 |value| 当有数据请求或有任何数据发生变化时触发|
 |childAdded| 当有新增子节点时触发|
 |childChanged|当某个子节点发生变化时触发 |
 |childRemoved|当有子节点被删除时触发 |



* callback `function(snapshot)`  `snapshot`  为`Snapshot` 类型
 当监听到某事件时callback 会被执行. 



```js
ref.on('childAdded',function(snapshot){
		console.log(snapshot.val());
});
```
--------


## once(type,callback)
同on 类似,不同之处在于 once只被执行一次.当`type='value'` 效果等同于查询操作
#### params
* type

 |事件|说明|
 |----|----|
 |value| 当有数据请求或有任何数据发生变化时触发|
 |childAdded| 当有新增子节点时触发|
 |childChanged|当某个子节点发生变化时触发 |
 |childRemoved|当有子节点被删除时触发 |

* callback `function(snapshot)`  `snapshot`  为`Snapshot` 类型
 当监听到某事件时callback 会被执行. 

```js

ref.once('childAdded',function(snapshot){
		console.log(snapshot.val());
});

```

----------



# Snapshot
Snapshot是当前时间,某个节点数据的副本,Snapshot不会随当前节点数据的变化而发生改变.
用户不会主动创建一个Snapshot,而是和 on或once 配合使用.

## val()
返回当前快照的数据
#### return 
* `object|string|null|number|boolean`
当前快照对应的数据

```js

ref=Wilddog("https://weather-control.wilddogio.com/city/Beijing");
ref.on('childChanged',function(snapshot){
	console.log(snapshot.val());
	//should output {"PM2.5":432}
})

```
``` js

ref.update({"PM2.5":432})
```
----------


## type()
返回快照的数据类型
#### return 
* `string`
当前数据的类型,返回值可能是 `'null' | 'object' | 'string' | 'number' `

```js

ref=Wilddog("https://weather-control.wilddogio.com/city/Beijing");
ref.on('childChanged',function(snapshot){
	if(snapshot.type()=='null'){
		//has been deleted
	}
	else if(snapshot.type()=='object'){
		//do something
	}
})

ref.update({"PM2.5":432})


```
``` js

ref.update({"PM2.5":432})
```
-----

## child(key)

#### params
* key `string`
	

#### return 

```js
ref=Wilddog("https://weather-control.wilddogio.com/city/Beijing");
ref.on('childChanged',function(snapshot){
	if(snapshot.type()=='null'){
		//has been deleted
	}
	else if(snapshot.type()=='object'){
		var pm25=snapshot.child('PM2.5');
		console.log("The pm2.5 of Bejing is",pm25.val())
	}
})


```
``` js

ref.update({"PM2.5":432})
```
-----

## forEach(callback)
遍历快照中每一个子节点,执行回调函数
#### params
* callback `function(key,data)`
  回调函数 `key` 当前子节点的key,`data` 当前子节点的value

``` js
ref=Wilddog("https://weather-control.wilddogio.com/city/Beijing");
ref.on(value,function(snapshot){
		snapshot.forEach(function(key,data){
			console.log("the",k,"of Bejing is:",data);
     });
});

```
``` js

ref.update({"PM2.5":432})
```

----------------------------------------------------------------------------------------

## hasChild(key)
检查是否存在某个子节点

#### params
* key 输入参数,关注子节点的key


#### return 
* `boolean` 
	`true` 子节点存在
	`false` 子节点不存在

```js

ref=Wilddog("https://weather-control.wilddogio.com/city/Beijing");
ref.on('childChanged',function(snapshot){
	if(snapshot.type()=='null'){
		//has been deleted
	}
	else if(snapshot.type()=='object'){
		if(snap.hasChild('PM2.5')){
			var pm25=snapshot.child('PM2.5');
			console.log("The pm2.5 of Bejing is",pm25.val())
		}
		
	}
})


```
``` js

ref.update({"PM2.5":432})
```


------------------------------------------------------------------------------------------

## key()
返回当前节点的key

#### return 
* `string` 当前节点的key值

```js
ref=Wilddog("https://weather-control.wilddogio.com/city/Beijing");
ref.on('childChanged',function(snapshot){
	if(snapshot.type()=='null'){
		//has been deleted
	}
	else if(snapshot.type()=='object'){
		if(snap.hasChild('PM2.5')){
			var pm25=snapshot.child('PM2.5');
			var key=snapshot.key()
			console.log("The ",pm25.key() ," of Bejing is",pm25.val())
		}
		
	}
})



```

--------------------------------------------------------------------------------------------

## numChild()
返回子节点的个数

#### return 
* `string` 子节点的个数

---------------------------------------------------------------------------------------------

## ref()
返回当前Wilddog 实例的引用
#### return 
* 当前Wilddog 实例的引用

```js

ref=Wilddog("https://weather-control.wilddogio.com/city/Beijing");
ref.on('childChanged',function(snapshot){
	if(snapshot.type()=='null'){
		//has been deleted
	}
	else if(snapshot.type()=='object'){
		if(snap.hasChild('PM2.5')){
			var pm25=snapshot.child('PM2.5');
			var key=snapshot.key();
			var _ref=pm25.ref();
			if(pm25.val()>500){
				_ref.set(500);
			}
			
		}
		
	}
})



```


