/*
 Title: COAP REST API
 Sort : 2
*/

## 改变一个节点
 改变一个节点的值,如果这个节点当前不存在,将会被创建.
#### REQUEST
 
```
CON PUT 
coap://{appid}.wilddogio.com/{path}
Payload:<payload>
Token: <token>
```

 * payload
  数据对象,字符串用json格式
  
 * token
	

#### RESPONSE
```
 ACK 
<response code>
 Payload:<payload>
 Token:<token>
```

 |state |response code|payload|
 |---|---|---|
 |操作成功|2.04||
 |没有权限|4.03|`{"err":"authority required"}` |
 |others| -| 参照错误码解释|
#### SAMPLE

```
//request
 put:   "coap://myapp.wilddogio.com/devices/123eabd7654" 
 data:  {"deviceName":"timemachine","deviceType":"universe destroyer"}
 //response
 code:  2.04

```

----

## 新增一个节点
 在当前节点下新增数据,数据的id由服务端生成,通过payload(data)返回
#### REQUEST

```
 CON 
 POST
 coap://{appid}.wilddogio.com/{path}
 Payload:<payload>
 Token:<token>
```
 
 * payload
 数据对象,字符串用json格式

#### RESPONSE
```
 ACK
 <response code>
 Payload:<payload>
 Token:<token>
```


 |state |response code|payload|
 |---|---|---|
 |操作成功|2.01|`{"id":<generated id>}` |
 |没有权限|4.03|`{"err":"authority required"}` |
 |others| -| 参照错误码解释|



```
 //request
 post:   "coap://myapp.wilddogio.com/devices"
 data:   {"deviceName":"timemachine","deviceType":"universe destroyer"}
 //response
 code:   2.01
 data:   {"id":"123eabd7654"}
 // now we can aquire the data with request coap://myapp.wilddogio.com/devices/123eabd7654

```

----


### 删除一个节点

 删除某个节点,以及节点下的所有子节点
#### REQUEST

```
CON
DELETE
coap://{appid}.wilddogio.com/{path}
Token:<token>

```

#### RESPONSE

```
 ACK
 <response code>
 Payload:<payload>
 Token:<token>
```
 |state |code|payload|
 |---|---|---|
 |操作成功|2.02| |
 |没有权限|4.03|`{"err":"authority required"}` |
#### SAMPLE
```
 //request
 delete: "coap://myapp.wilddogio.com/devices/123eabd7654"
 //response
 code:   2.02
 
```



## 查询操作
#### REQUEST

```
 CON
 GET coap://{appid}.wilddogio.com/{path}
 Token:<token>
```

#### RESPONSE

```
 ACK
 <response code>
 Payload:<payload>
 Token:<token>
```

 |state |response code|payload|
 |---|---|---|
 |操作成功|2.05| data in JSON format |
 |没有权限|4.03|`{"err":"authority required"}` |

#### SAMPLE
```
 //request
 get:    "coap://myapp.wilddogio.com/devices/123eabd7654"
 //response
 code:   2.05
 data:   {"deviceName":"timemachine","deviceType":"universe destroyer"}
```



## 监听一个节点的变化
用户发送一个特殊的get 请求监听某个节点上数据的变化.当服务端有数据更新的时候会给客户端发送 notification.
#### REQUEST
```
 CON
 
 Payload:<payload>
 Observe:0
 Token:<token>
```
#### RESPONSE
```
 ACK
 <response code>
 Payload:<payload>
 Observe:<seq code>
 Token:<token>
```
 |state |code|payload|seq code|
 |---|---|---|---|
 |操作成功|2.05| data in JSON format |严格递增的序列 |
 |没有权限|4.03|`{"err":"authority required"}` | |

#### NOTIFICATION
```
 ACK
 <response code>
 Payload:<payload>
 Observe:<seqence number>
 Token:<token>
```
 
 |state |code|payload|seq code|
 |---|---|---|---|
 |操作成功|2.05| data in JSON format |严格递增的序列 |

## 取消监听
```
 RST
 Token:<token>
```

#### SAMPLE
```
 //register
```


##  授权
 在任何操作加一个参数 `token=<token>` TOKEN 的获取不在此文档之内
 
#### sample
 ```
 put:   "coap://myapp.wilddogio.com/devices/123eabd7654?token=322E32E32" 
 data:  {"deviceName":"timemachine","deviceType":"universe destroyer"}
 
 ```


## coap状态码在
```
	"2.01":"Created",
	"2.02":"Deleted",
	"2.03":"Valid",
	"2.04":"Changed",
	"2.05":"Content",
	"4.00":"Bad Request",
	"4.01":"Unauthorized",
	"4.02":"Bad Option",
	"4.03":"Forbidden",
	"4.04":"Not Found",
	"4.05":"Method Not Allowed",
	"4.06":"Not Acceptable",
	"4.12":"Precondition Failed",
	"4.13":"Request Entity Too Large",
	"4.15":"Unsupported Content-Format",
	"5.00":"Internal Server Error",
	"5.01":"Not Implemented",
	"5.02":"Bad Gateway",
	"5.03":"Service Unavailable",
	"5.04":"Gateway Timeout",
	"5.05":"Proxying Not Supported"
	
```

