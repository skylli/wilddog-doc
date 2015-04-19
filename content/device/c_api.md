/*
Title: COAP C WRAPPER API
Sort: 3
*/
# C WRAPPER API

## init
 `wilddog_t* wilddog_init(char* url)`
初始化一个wilddog 客户端
**参数**
 * `url` :`coap[s]://<appid.wilddogio.com/<path`.
 `<appid>`: 开发者在 wilddog 平台申请的应用id
 `<path>` : 客户端关心的路径

**返回值**
返回指向wildog_t 结构体的指针
#### sample
```c

int main(){
//init client
wilddog_t* wd=wilddog_init("coaps://myapp.wilddogio.com/user/jackxy/device/light/10abcde");
//do something
//...
//recycle memeory
wilddog_destroy(wd)
}
```



## destroy
 `int wilddog_destroy(wilddog_t* wilddog);`
 销毁一个客户端 回收内存
 
**参数**
* `wilddog` :  已经初始化的`wilddog_t`结构体的指针.

*返回值**

* 返回 `0`:成功 `<0`:失败

## setAuth

 #### `void wilddog_setAuth(wilddog_t* wilddog,unsigned char* auth);`
更新auth
``` c
...
//aquired a new auth token
char* newToken="ABCD1234567890"

wilddog_setAuth(wd,newToken);
...
```

## query

 `int wilddog_query(wilddog_t* wilddog,onCompleteFunc callback)`
 获取当前节点的数据,数据类型为cJSON .数据格式为json格式.
 
 **参数**
* `wilddog` :  已经初始化的`wilddog_t`结构体的指针.
* `callback` : 函数指针 ,类型是
 *`void (*onCompleteFunc)(wilddog_t* wilddog,int handle,int err)`*其中 `wilddog` 在回调时会被传入当前实例的指针,`handle` 唯一标示一操作,用于关联回调和请求,与 `wilddog_set` 函数的返回值相同(在正确的情况下).获取当前节点数据的方式是 `wilddog-data`.
 
**返回值**
 * 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0` 的整数 表示此次操作的ID,与 callback 中被传入的参数`handle` 相同,当函数调用出错
 
#### sample
```c
void onQueryComplete(wilddog_t* wilddog,handle,int errCode){
    if(errCode<0)
        printf("query error:%d",errCode)
    else{
       cJSON* data= wilddog-data;
       //do something with data via cJSON API
    }
}
int main(){
    wilddog_t* wd =wilddog_init(<someUrl);
    //...
    int handle=wilddog_query(wd,onQueryComplete);
    if(handle<0)
       return 0;
    while(1){
        //使用事件循环的方式,需要循环接收网络事件并处理.
        trySync(wd);
    }
}
```

## set
 `int wilddog_set(wilddog_t* wilddog,cJSON* data,onCompleteFunc callback)`
 设置当前节点的数据,数据类型为cJSON .数据格式为json格式.
 
 **参数**
* `wilddog` :  已经初始化的`wilddog_t`结构体的指针.
* `data` : `cJSON` 类型的指针, `cJSON` 为wilddog 客户端存储格式,兼容所有cJSON库的函数.(cJSON 库的使用API 请参见xxxxx)
* `callback` : 函数指针 ,类型是
 *`void (*onCompleteFunc)(wilddog_t* wilddog,int handle,int err)`*其中 `wilddog` 在回调时会被传入当前实例的指针,`handle` 唯一标示一操作,用于关联回调和请求,与 `wilddog_set` 函数的返回值相同(在正确的情况下).获取当前节点数据的方式是 `wilddog-data`.
 
**返回值**
 * 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0` 的整数 表示此次操作的ID,与 callback 中被传入的参数`handle` 相同,当函数调用出错
 

#### sample
```c
void onSetComplete(wilddog_t* wilddog,handle,int errCode){
    if(errCode<0)
        printf("query error:%d",errCode)
    else{
       cJSON* data= wilddog-data;
       //do something with data via cJSON API
    }
}
int main(){
    wilddog_t* wd =wilddog_init(<someUrl);
    char* newDataStr="{\"name\":\"jackxy\",\"age\":27}";
    cJSON* newData=cJSON_parse(newDataStr);
    int handle=wilddog_set(wd,newData,onSetComplete);
    if(handle<0)
       return 0;
    while(1){
        //使用事件循环的方式,需要循环接收网络事件并处理.
        trySync(wd);
    }
}
```

## push
 `int wilddog_push(wilddog_t* wilddog,cJSON* data,onCompleteFunc callback)`

 在当前节点之下新增一条数据,数据的key在服务端生成
 
  **参数**
* `wilddog` :  已经初始化的`wilddog_t`结构体的指针.
* `data` : `cJSON` 类型的指针, `cJSON` 为wilddog 客户端存储格式,兼容所有cJSON库的函数.(cJSON 库的使用API 请参见xxxxx)
* `callback` : 函数指针 ,类型是
 *`void (*onCompleteFunc)(wilddog_t* wilddog,int handle,int err)`*其中 `wilddog` 在回调时会被传入当前实例的指针,`handle` 唯一标示一操作,用于关联回调和请求,与 `wilddog_set` 函数的返回值相同(在正确的情况下).获取当前节点数据的方式是 `wilddog-data`. 
  
  
 **返回值**
* 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0` 的整数 表示此次操作的ID,与 callback 中被传入的参数`handle` 相同,当函数调用出错

#### sample
```c
void onPushComplete(wilddog_t* wilddog,handle,int errCode){
    if(errCode<0)
        printf("query error:%d",errCode)
    else{
       cJSON* data= wilddog-data;
       cJSON* newData=wilddog-newData;
       //do something with data via cJSON API
    }
}
int main(){
    wilddog_t* wd =wilddog_init(<someUrl);
    char* newDataStr="{\"name\":\"jackxy\",\"age\":27}";
    cJSON* newData=cJSON_parse(newDataStr);
    int handle=wilddog_push(wd,newData,onPushComplete);
    if(handle<0)
       return 0;
    while(1){
        //使用事件循环的方式,需要循环接收网络事件并处理.
        trySync(wd);
    }
}
```

## remove

 `int wilddog_Remove(wilddog_t* wilddog,onCompleteFunc callback);`

删除当前节点下所有数据

**参数**
* `wilddog` :  已经初始化的`wilddog_t`结构体的指针.
* `callback` : 函数指针 ,类型是
 *`void (*onCompleteFunc)(wilddog_t* wilddog,int handle,int err)`*其中 `wilddog` 在回调时会被传入当前实例的指针,`handle` 唯一标示一操作,用于关联回调和请求,与 `wilddog_set` 函数的返回值相同(在正确的情况下).获取当前节点数据的方式是 `wilddog-data`. 
**返回值**
* 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0` 的整数 表示此次操作的ID,与 callback 中被传入的参数`handle` 相同,当函数调用出错

#### sample
```c
void onRemoveComplete(wilddog_t* wilddog,handle,int errCode){
    if(errCode<0)
        printf("query error:%d",errCode)
    else{
       //do something 
    }
}
int main(){
    wilddog_t* wd =wilddog_init(<someUrl);
    int handle=wilddog_remove(wd,newData,onRemoveComplete);
    if(handle<0)
       return 0;
    while(1){
        //使用事件循环的方式,需要循环接收网络事件并处理.
        trySync(wd);
    }
}
```


## on
 `int wilddog_on(wilddog_t* wilddog,onDataFunc onDataChange,onCompleteFunc callback)`
 观察当前数据的变化,一旦数据改变, `onDataChange`函数将被调用.
**参数**

* `wilddog` :  已经初始化的`wilddog_t`结构体的指针.
* `onDataChange` :  函数指针,类型是
 *`void (*onDataFunc)(wilddog_t* wilddog,cJSON* value)`* 其中,`wilddog`是当前实例的指针.`value` 是数据变化后的值
* `callback` : 函数指针 ,类型是
 *`void (*onCompleteFunc)(wilddog_t* wilddog,int handle,int err)`*其中 `wilddog` 在回调时会被传入当前实例的指针,`handle` 唯一标示一操作,用于关联回调和请求,与 `wilddog_set` 函数的返回值相同(在正确的情况下).获取当前节点数据的方式是 `wilddog-data`. 
 
**返回值**
* 在出错的情况下返回 `<0` 的整数, 在正常情况下返回 `0` 的整数 表示此次操作的ID,与 callback 中被传入的参数`handle` 相同,当函数调用出错


#### sample
```c
void onDataChange(wilddog_t* wilddog,cJSON* value){
  if(value==NULL){
      return ;
  }
  char* c=cJSON_print(value);
  printf("new data is: %s",c);
  free(c);
}
int main(){
    wilddog_t* wd =wilddog_init(<someUrl);
    int handle=wilddog_on(wd,onDataChange,NULL);
    if(handle<0)
       return 0;
    while(1){
        //使用事件循环的方式,需要循环接收网络事件并处理.
        trySync(wd);
    }
}
```


## off
 `void wilddog_off(wilddog_t* wilddog);`
取消关注一个事件(对应于on)

**参数**

* `wilddog` :  已经初始化的`wilddog_t`结构体的指针.



## trySync
 `int wilddog_trySync(wilddog_t* wilddog);`

 wilddog同步生效依赖 `trySync` 必须以一定的频率被调用.调用的频率取决于硬件和应用场景,每调用一次程序尝试接收来自云端的推送和其他消息.所有的事件触发和回调函数被调用都发生在`trySync` 过程中.另外,如果不指定`syncTime`函数,wilddog 客户端计时也依赖于 trySync函数调用,更多设置参考 **移植与配置文档**

**参数**

* `wilddog` :  已经初始化的`wilddog_t`结构体的指针.

**返回值**



#### sample

