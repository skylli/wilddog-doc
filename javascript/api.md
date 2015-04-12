# Wilddog

## Wilddog(wilddogUrl)
初始化一个Wilddog客户端

#### params

* wilddogUrl `string`
 关注节点的绝对路径,


#### return
* Wilddog 对象引用

```js

ref=Wilddog("http://weather-control.wilddog.com/city/Beijing");
//yeah,lets do something really bad

```

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
ref.authWithPassword({email:"badass@wilddog.com",password:"asshole"},
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
通过
调用`authWithOAuthPopup` ,页面跳转到 OAuth授权也,用户在页面进行授权操作,此过程中的任何数据都不会经过第三方 (包括WILDDOG 服务),而且全部采用https 访问,因此安全可靠.当授权结束页面跳转回最初页面,


#### params
* provider `string`  
e.g.`"weibo"` (目前支持微博平台).oauth服务的提供平台,目前支持的平台有 `weibo` `wechat`
* callback `function(err,auth)`
  如果授权失败err 为代表错误的对象 ,因为页面跳转,callback永远不会被执行.

```js

ref.authWithPassword({email:"someEmail"password:"password"},
        function(err,auth){
	        //不会被执行
            console.log(err,auth);
            
});

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
ref.authWithPassword({email:"someEmail"password:"password"},
		function(err,auth){
			if(err==null){
				//auth success
				console.log(auth)
			}
			else{
				//lets take care of err
				console.log(err)
			}
		}
);

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
ref.createUser({email:"badass@wilddog.com",password:"asshole"},
		function(err,data){
			console.log(err,data);
});
```

----

## child(key)
返回当前节点的子节点的引用

#### params
* key 子节点名,可以是相对当前节点的路径.

#### return
* 子节点的引用



```js

var ref=Wilddog("https://someApp.wilddogio.com/p1");
//ref refer to node someApp.wilddogio.com/p1
child_ref=ref.child('abc');
//now child_ref refer to node someApp.wilddogio.com/p1/abc

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
var ref=Wilddog("https://someApp.wilddog.com/user/name");
//return the key to current node
var key=ref.key();
//key is 'name'

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
新插入子节点的引用


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



* callback `function(dataSnapshot)`  `dataSnapshot`  为`DataSnapshot` 类型
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

* callback `function(dataSnapshot)`  `dataSnapshot`  为`DataSnapshot` 类型
 当监听到某事件时callback 会被执行. 

```js

ref.once('childAdded',function(snapshot){
		console.log(snapshot.val());
});

```

----------



# DataSnapshot

## val()

#### params

#### return 

------------------------------------------------------------------------------------------

## child()

#### params

#### return 

-----------------------------------------------------------------

## forEach(action)

#### params
* action `function(key,data)`




``` js
ref.on(childAdded,function(snapshot){
		snapshot.forEach(function(key,data){
			console.log(k,data);
     });
});

```

----------------------------------------------------------------------------------------

## hasChild([key])

#### arguments

#### return 

------------------------------------------------------------------------------------------

## key()

#### arguments

#### return 

--------------------------------------------------------------------------------------------

## numChildren()

#### arguments

#### return 

---------------------------------------------------------------------------------------------

## ref()

#### arguments

#### return 

