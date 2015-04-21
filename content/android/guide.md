/*
Title : 开发向导
Sort : 2
*/


# 1 了解 Wilddog 云数据存储

## 更像一个 JSON Tree
Wilddog云存储使用树形数据结构，替代古老的数据table的方式。树形数据天然拥有关系型数据的特点，而且更能直观表述数据之间的关系。
整个树形数据更像一个JSON对象，没有 table 或 record，所以我们使用JSON来表述这棵数据树。每一个数据节点，都可以用一个 path 来表示，如下：

```JSON
	{
		"users" : {
			"lich" : { "age" : 35, "Shape" : "thin" },
			"Pudge" : {"age" : 60, "Shape" : "fat", "ability" : "gank" }
		}		
	}
```
`lich` 节点的path为`/users/lich`，该节点还有两个子节点做为它的属性。而 `Pudge` 节点可以拥有三个属性。所以更像NoSQL数据库的存储方式，比如mongoDB的JSON方式。`lich` 与 `Pudge` 节点做为 `users` 的子节点，可以将 `users` 看作一个table，`lich` 与 `Pudge` 看作 `users` 的数据项。

更像NoSQL，或者说更像JSON对象的一点，可以给 `users` 添加一个 `amount` 子节点，可以看作 `users` 的属性，如下：

```JSON
	{
		"users" : {
			"lich" : { "age" : 35, "Shape" : "thin" },
			"Pudge" : {"age" : 60, "Shape" : "fat", "ability" : "gank" },
			"amount" : 2
		}		
	}
```

## 节点名称
每个节点名称作为key，在同一父节点下值唯一。path作为节点的全名称，全局唯一。全名称有最大长度限制，小于等于1024Byte。节点名中不能包含一些特殊ASCII 字符，在ASCII范围内只支持 `0-1 a-z A-Z` 和 `_` `-` `:`三个符号，ASCII范围外支持UTF-8编码集。
节点key一旦创建是不能修改的。

## 节点Value
节点值支持 `String` `Boolean` `Number` 和 `null` 。当数据为 `null` 的时候表示数据不存在（或者删除该节点）。
当本节点包含子节点的时候，可以将整个子树看作本节点的value。
节点value最大长度不能超过1024Byte。

## List 与 Array
Wilddog没有原生支持 `List` 与 `Array` 。如果试图存储一个 `List` 与 `Array`，有替代方案解决，可以被存储为一个对象节点，整数作为key。如下：

```JSON
// you want this
['Jan', 'Feb', 'Mar']
// replace
{0: 'Jan', 1: 'Feb', 2: 'Mar'}
```  

## Path
每个数据节点都有一个对应的 `path` 。读和写Wilddog的数据时，我们首先创建一个数据存储的引用，加载指定的 `URL` 。其中， `URL` 包含一个 `URI` ，就是使用数据节点的 `ptah`  作为 `URI`  。

```Java
WdClient client = new WilddogIO('https://<appId>.wilddogio.com/test/data');
```
该引用的 `URI` 为 `/test/data`，也是数据节点的 `path` 
因此，每个数据都有统一资源定位，通过浏览器访问地址 `https://<appId>.wilddogio.com/test/data.json`，可以获取该节点JSON数据；如果在登录状态可以直接访问 `https://<appId>.wilddogio.com/test/data`，进入该节点的数据预览页面。

# 2 建立连接

使用App的域名，建立一个Wilddog client连接。
```Java
try{
	WdClient client = new WilddogIO("https://demo.wilddogio.com/test/data");
} catch(Exception e) {
	e.printStackTrace();
}
```
`new WilddogIO()` 需要使用`try catch` ，当出现异常时，建立连接失败。成功后返回的client定位到`/test/data` 这个数据节点上。此时并没有开始同步数据。
之后多次调用`new WilddogIO()`，可以给于不同的URI来定位不同的数据的节点，但是对于同一个AppId，本地仅会建立一个连接；也可以通过`child()` 与 `parent()` 方法来定位数据节点。
定位完节点，获得节点的引用 `WdClient` ，可以对该节点进行读写操作。


# 3 读取数据

Wilddog 通过为client附加一个异步EventHandler监听器来获得数据。监听器将触发一次数据的初始化和同步后续数据变化。
使用 `on()` 监听一个数据节点的变化。

```Java
try{
	AckFuture future = client.on(new EventHandler(){
		  public void onChildAdded(Snapshot data) {}
	
		  public void onChildChanged(Snapshot data) {}
	
		  public void onChildRemoved(Snapshot data) {}
		  
		  public void onChanged(Snapshot data) {
			   System.out.println(data.value());
		  }
	
	});
} catch(Exception e) {
	e.printStackTrace();
}
```

监听器使用callback模式，每个callback方法接收到Snapshot对象，是数据的快照，所以为只读数据。调用`Snapshot.value()` 返回Object对象，可能的类型为`Boolean` `String` `Number` `Map<String, Object>` `null`。如果没有数据存在，将返回`null`。

像这样，实现`onChanged` 接口，将触发一次数据的初始化，即从云端pull数据到本地，之后云端 push 该数据节点的变化数据，包括子节点的变化。

上面事例已经接触到了`EventHandler` 与 `Snapshot` 俩个重要类，下面详细说明这两个类。

## EventHandler

监听器分4个监听事件，`Value Changed` `Child added` `Child removed` `Child Changed`。分别对应四个callback方法`changed()`  `childAdded()` `childRemoved()` `childChanged()`。

### Value Changed

本地第一次pull数据的时候，需要实现该接口，并在后续该数据节点发生变化时也将触发该方法。
该方法获得Snapshot参数，代表最新的数据，非叶子节点，将包含所有下级的子节点。

### Child Added

当本节点有新的子节点添加成功时，将触发`childAdded()`。如果一次同步有N个子节点添加成功，将触发N次`childAdded()`。如果新加的子节点还包含子节点，这个孙子节点不会触发`childAdded()`，但是将会触发`childChanged()`。
该方法获得Snapshot参数，代表新添加的子节点数据，非叶子节点，将包含新的子节点的所有下级子节点。

### Child Removed 

当本节点有子节点被删除成功时，将触发`childRemoved()`。如果一次同步有N个子节点被删除，将触发N次`childRemoved()`。如果被删除的子节点还包含子节点，这些孙子节点也将被删除，但是不会触发`childRemoved()`，但是将会触发`childChanged()` 。
该方法获得Snapshot参数，代表被删除的子节点数据，非叶子节点，将包含被删除子节点的所有下级子节点。

### Child Changed

当本节点有子节点发生变化时，将触发`childChanged()`。如果一次同步有N个子节点被修改，将触发N次`childChanged()`。触发`childChanged()`的条件有：

* 子节点的value发生变化；
* 孙子节点有value发生变化；
* 子节或孙子节点发生`childRemoved` `childChanged` `childAdded`。

## Snapshot

# 4 修改数据
