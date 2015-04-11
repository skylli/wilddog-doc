
## Wilddog(wilddogUrl)
初始化一个Wilddog客户端

### arguments

* wilddogUrl `string`
 关注节点的绝对路径,


#### return
* Wilddog 对象引用

```js
ref=Wilddog("http://demo.wilddog.com/path1/path2");
```

----


## authWithPassword(credentials,callback)
通过邮箱密码授权


#### arguments

 credentials `object`
包含用户授权信息的数据,通常包含`email` `password` 
(eg.`{"email":<email>,"password":<password>}`)


* callback `function(err,auth)` 
  如果操作成功`err` 为null,如果不成功 `err` 是一个包含 `code` 的对象 ,如果`err==null` auth为包含用户授权信息的对象

```js
ref.authWithPassword({email:"someEmail"password:"password"},
		function(err,auth){
			console.log(err,auth);
});
```
----

## authWithOAuthRedirect(provider,callback);
通过
调用`authWithOAuthPopup` ,页面跳转到 OAuth授权也,用户在页面进行授权操作,此过程中的任何数据都不会经过第三方 (包括WILDDOG 服务),而且全部采用https 访问,因此安全可靠.当授权结束页面跳转回最初页面,


#### arguments
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

#### arguments
* provider `string`  e.g.`"weibo"` (目前支持微博平台)
 oauth服务的提供平台,目前支持的平台有 `weibo` `wechat`
 
* callback `function(err,auth)`
  如果授权失败err 为代表错误的对象

```js
ref.authWithPassword({email:"someEmail"password:"password"},
        function(err,auth){
            console.log(err,auth);
});

```

----

## createUser(credentials,callback)
通过邮箱注册用户
通过`createUser` 注册的终端用户会托管在`WILDDOG` 平台, 被注册的用户可以采用 `authWithPassword` 授权.

#### arguments
* credentials `object`
包含用户认证信息的数据,通常包含`email` `password` 
(eg.`{"email":<email>,"password":<password>}`)

* callback `function(err,data)`
如果操作成功`err` 为null,如果不成功 `err` 是一个包含 `code` 的对象 ,如果`err==null` data为包含用`id` ,`provider` 的 `object`


```js
ref.createUser({email:"someEmail",password:"password"},
		function(err,data){
			console.log(err,data);
});
```

----

## child(key)
返回当前节点的子节点的引用

#### arguments
* key 子节点名,可以是相对当前节点的路径.

#### return
* 子节点的引用



```js

var ref=Wilddog("https://someApp.wilddogio.com/p1");
//ref refer to node someApp.wilddogio.com/p1
child_ref=ref.child('abc');
//now child_ref refer to node someApp.wilddogio.com/p1/abc

```



## parent()
#### return
* 父节点的ref

```js
//return the refer to the father node of current
var parent_ref=ref.parent();
```


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




## set(value,[oncomplete])
设置一个节点的值.并且同步到云端
如果当前节点不为`null` ,老值会被value覆盖.


#### arguments

* value `object|string|number|boolean|null`
 value 可以是对象,字符串,数字,null.当value 不为null,设置当前节点的值为value
 <br/>
* onComplete `function(err)` 
如果操作成功 `err==null` 否则,err为包含code的`object`  如果`code==1201`,此用户无权限访问当前节点,出现这种情况可能是因为没有进行授权,或者授权的用户无访问权限
```js
var ref=Wilddog("https://someApp.wilddogio.com/a/b/c");
ref.set({"name":"jack","action":"attack"})

```

## update(value,[onComplete])
更新一个节点的值
`value`只允许是`object`类型,如果当前节点的值是	`null`或 `object`,当前节点的值会被新值覆盖,如果老的数值是`object`,  `value` 会与老的

#### arguments
* value `object`

* onComplete `function(err)`
如果操作成功 `err==null` 否则,err为包含code的`object`




## remove([onComplete])
删除一个节点,效果等同于 `set(null,[onComplete])`
#### arguments
* onComplete `function(err)`

如果操作成功 `err==null` 否则,err为包含code的`object`



## push(value,[oncomplete])
新增一个节点,节点的	`key` 自动生成,节点的值为 `value`

#### arguments
* value `object|string|number|boolean`




#### goOnline()
上线



#### goOffline()
下线



## on(type,[callback])
监听某个事件
#### arguments

* type

|事件|说明|
 |----|----|
 |value| 当有数据请求或有任何数据发生变化时触发|
 |childAdded| 当有新增子节点时触发|
 |childChanged|当某个子节点发生变化时触发 |
 |childRemoved|当有子节点被删除时触发 |



* callback `function(dataSnapShot)`
 当监听到某事件时callback 会被执行

#### sample

```js
ref.on('childAdded',function(snapshot){
		console.log(snapshot.val());

});
```



## once(type,[callback])
只响应一次事件(当`type==value` 时,可理解为查询操作)
#### arguments
* type

 |事件|说明|
 |----|----|
 |value| 当有数据请求或有任何数据发生变化时触发|
 |childAdded| 当有新增子节点时触发|
 |childChanged|当某个子节点发生变化时触发 |
|childRemoved|当有子节点被删除时触发 |

<br/>

* callback `function(dataSnapShot)`
>> 当监听到某事件时callback 会被执行
>>
>###### return






### DataSnapShot

#### val()

###### arguments

###### return 

------------------------------------------------------------------------------------------

#### child()

###### arguments

###### return 

-----------------------------------------------------------------

#### forEach(action)

>###### arguments
>>* action `function(key,data)`
>
>###### return 
>> null
>
>###### sample
>
> ```js
>ref.on(childAdded,function(snapshot){
>		snapshot.forEach(function(key,data){
>			console.log(k,data);
>     });
>});
>
>```

----------------------------------------------------------------------------------------

#### hasChild([key])

###### arguments

###### return 

------------------------------------------------------------------------------------------

#### key()

###### arguments

###### return 

--------------------------------------------------------------------------------------------

#### numChildren()

###### arguments

###### return 

---------------------------------------------------------------------------------------------

#### ref()

###### arguments

###### return 

