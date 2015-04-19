/*
Title : 开发向导
Sort :2
*/



# 了解 Wilddog 云数据存储

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
因此，每个数据都有统一资源定位，通过浏览器访问地址 `https://<appId>.wilddogio.com/test/data.json`，可以获取该节点JSON数据；如果在登录状态可以直接访问 `https://<appId>.wilddogio.com/test/data`,进入该节点的数据预览页面。
