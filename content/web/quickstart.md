/*
Title: 快速入门
Sort: 0

*/


## 第一步 创建一个账户
你需要做的第一件事是注册一个Wilddog的免费账号。你将拥有独立、属于你自己的项目空间。

----

## 第二步 创建App
进入控制面板，新建一个App项目，你需要为新的App起一个响亮的名字，并且需要设置一个唯一AppId作为你的项目访问的URL（appId.wilddogio.com）。我们将使用这个URL存储和同步数据。

创建App成功后，Wilddog将为你初始化一个TreeDB（树型数据库），你就可以操作这个数据库了。

----

## 第三步 在页面引入 Wilddog SDK
在你的页面中引入Wilddog SDK非常简单,只需要一行代码就能搞定
``` html
<script src="http://cdn.wilddog.com/js/client/0.3.0/wilddogio.js" >

```

----

## 第四步 连接到Wilddog
在操作数据库之前，需要先连接到wilddog云端。使用SDK，通过你App的URL创建一个Wilddog引用。

```js
var ref =Wilddog("https://<appId>.wilddogio.com/")

```

----

`Wilddog()` 的参数URL可以包含一个URI，可以用于定位到数据的路径节点上。将树型数据的某一节点可以看作一个path，那么URI可以作为path使用，上面代码将定位到数据的root节点。如果URL为`http://<appId>.wilddogio.com/message`，那么URI为`/message`。

## 第五步 读写数据
WdClient提供了数据读写API，通过`set()` `update()` `push()` `remove()` 修改对应节点的数据；通过`on()`立即读取数据，并监听某一节点数据的持续变化。

### 读数据
先为 `ref` 附加一个监听event处理，然后数据一旦有变化，可以同步到最新的数据。通过`on()`监听对应节点，并读取到数据，你需要实现回调函数。
```js
ref.on('value',function(snapshot){
	//..读取snapshot进行其他操作
});
```

----

### 写数据
一旦我们有一个Wilddog 引用，我们可以使用`set`给该节点设置值，值的类型为`String` `Boolean` `Number` `Object` 。
```js
ref.set("hello world!!!");
```
如果有ref 通过`on()`监听了相同path，那么这个client将收到上面`set()`的新值。

----
