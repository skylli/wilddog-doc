/*
Title : 开发向导
Sort : 1
*/


## 1.安装与设置

#### 创建一个帐号

首先,你需要[ 注册一个Wilddog帐号 ](https://www.wilddog.com/account/signup). 一个App会被创建.每一个App都有一个独立的域名 `<appid>.wilddogio.com`.你会使用这个url 进行存储和同步数据

在你的Wilddog 控制台里,你可以实时对数据进行创建,管理,删除等操作.同时你可以创建安全规则,管理授权系统.查看统计数据

#### 安装Wilddog

下一步,你需要将Wilddog javascript 客户端引入你的页面,在HTML的`<head>` 中增加一个 `script` 标签.推荐直接通过我们的 CDN 引入:

```html
<script src="https://cdn.wilddog.com/js/client/0.3/wilddogio.js"></script>
```

## 2.了解数据

#### 数据是一棵 JSON 树
所有的数据都存储在各异 JSON 对象中,没有任何表的概念,当你把数据添加到这棵json 树中,这些数据就变成这棵树的子树.

#### 创建一个Wilddog 对象引用

在html中读写wilddog数据,需要创建一个Wilddog对象引用, 要操作和同步哪些数据取决于创建 Wilddog对象引用时传入的URL
```js
var ref=Wilddog("https://doc-example.wilddogio.com/city/Beijing")
```
创建一个Wilddog引用并不是直接访问这个URL,或创建一个连接.数据直到需要的时候才会传输.一旦这个数据被查询,这个数据会一直与服务端保持一致.

> **数据限制**
> 一个子节点的key不能长于768byte,不能深于32层,不能包含ASCII 控制字符0-31 和127 .另外,不能包含以下字符 `.` `$` `#` `[` `]` `/`

你可以直接访问一个子节点:
``` js
var ref=Wilddog("https://doc-example.wilddogio.com/city/Beijing")
```


你还可以通过 child接口进行相对路径访问:


```js
var root=Wilddog("https://doc-example.wilddogio.com")
var ref=root.child("city/Beijing")
```

#### 限制和约束

| 描述 | 约束 | 备注 |
| --- | --- | --- |
| 树的深度 |32 | |
|key的长度 | 768byte | UTF-8 编码,不能包含 `.` `$` `#` `[` `]` `/` 和 ASCII 控制字符 |
| 一个叶子节点的数据大小 | 10mb | UTF-8 编码 |
| 通过SDK写入的数据大小限制 | 16mb | UTF-8 编码 |
| 通过 REST 写入数据大小限制 |256mb |
| 一次能读取的节点 |1亿 |


## 3.保存数据

#### 保存数据的方式
|method |description | 
| --- |---- | 
| set() | 写入和替换当前路径的数据 |
| update() |修改部分子节点的数据 |
| push() | 在当前节点下新增一个数据,数据的key随机生成 |

#### 用 set() 写数据
set 是 Wilddog 最基本的写数据操作.set() 设置当前节点的值,如果当前节点已经存在值,set 会将旧值替换成新值
```js

```


#### 更新已经存在的数据

如果你想同时更新多个子节点,而不覆盖其他的子节点,你可以使用 update() 方法
```js

```

#### 保存一个列表
当多个用户同时试图在一个节点下新增一个子节点的时候,这时,数据就会被重写,覆盖.
为了解决这个问题,Wilddog push()采用了生成唯一ID 作为key的方式.通过这种方式,多个用户同时在一个节点下面push 数据,他们的key一定是不同的.这个key是通过一个基于时间戳和随机的算法生成的.wilddog采用了足够多的位数保证唯一性.
```js

```

>**获取唯一ID**
>调用push 会返回一个引用,这个引用指向新增数据所在的节点.你可以通过调用 `key()` 来获取这个唯一ID
> ```js
> 
> ```



## 4.查询数据



## 5.组织数据



## 6.了解安全规则


## 7.用户授权
