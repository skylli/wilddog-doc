# WdClient

## public WdClient parent()
获得当前Path的父节点引用对象（WdClient），如果当前已经到达root路径，调用该函数后返回依然是root的引用对象（WdClient）。

### Return
WdClient 上级引用对象

### Sample
```java
WdClient ref = WilddogIO("http://demo.wilddog.com/test/a");
// 获得'/test' 路径的引用
WdClient ref2 = ref.parent();
// 到达root
WdClient re3 = ref.parent().parent();
```
----

## public WdClient child(String path)
定位到当前路径下的相对路径的子节点，返回WdClient对象引用。参数path为相对路径，多层级间需要使用“/”分隔，例如“a/b/c”。

### Param
* path `String`
path为相对路径，多层级间需要使用"/"分隔，例如“a/b”。如果path为空或null则返回当前引用。如果直接下一级，可以使用无分隔符“/”的节点名称表示，例如“a”。如果定位的path在client端与cloud端都不存在，依然可以定位，后续数据操作的时候，将延迟动态创建不存在的路径节点。

### Return
WdClient 子节点引用。

### throws PathFormatException
path解析异常。

### Sample
```java
WdClient ref = WilddogIO("http://demo.wilddog.com/test");
// 定位到 '/test/a'
WdClient ref2 = ref.child("a");
// 定位到 '/test/a/b'
WdClient re3 = ref.child("a/b");
WdClient re4 = ref.child("a").child("b");
```
----

## public String key()
获得当前path对应的node名称。

### Return
String node名称

### Sample
```java
WdClient ref = WilddogIO("http://demo.wilddog.com/test");
// 返回 “test”
String name = ref.key();
// 返回 “a”
name = ref.child("a").key();
```
----

## public AckFuture on(EventHandler handler)
在当前path上绑定事件，监听该节点数据或子树的变化。用户需要实现EventHandler接口。本地的数据操作setValue、update、remove、push将触发绑定事件；其他client对本client所on的节点进行了修改，将触发绑定的事件。

### Param
* handler `EventHandler`
handler将监听Change、ChildAdded、ChildRemoved、ChildChanged事件，分别对应EventHandler接口中的函数，每个函数都有一个参数data，类型为Snapshot。详细见EventHandler文档。
> `Change()` 监听node数据或子树的变化，参数data为最新数据。
> `ChildAdded()` 监听下一级添加新的子节点，参数data为新的子节点的数据。
> `ChildRemoved()` 监听下一级被删除的子节点，参数data为被删除的子节点数据。
> `ChildChanged()` 监听下一级被修改的子节点，子节点的下级节点中发生任意变化都将触发该事件，参数data为修改后的子节点数据。

### Return
AckFuture 实现阻塞等待，调用`await()`可以等待`on()`结束，如果返回true表示操作成功；返回false表示操作失败，同时`getError()`获得错误原因。详细见AckFuture文档。

### Sample
```java
WdClient ref = WilddogIO("http://demo.wilddog.com/test");
AckFuture future = ref.on(new EventHandler(){
	  public void onChildAdded(Snapshot data) {}

	  public void onChildChanged(Snapshot data) {}

	  public void onChildRemoved(Snapshot data) {}
	  
	  public void onChanged(Snapshot data) {}

});
// 阻塞等待on操作结果
boolean ret = future.await();
```
----

## public void setValue(Object value)
在当前Path进行覆盖性的赋值操作，将本地当前value或children（整颗子树）替换，并同步到云端。如果操作成功将触发已绑定的event，例如Change，ChildAdded等。
该函数是线程安全的，将阻塞其他的本地数据操作。

### Param

* value `Object`
value的类型可以为String、Number、Boolean、null、Map或满足JavaBean规范的实体。
当value为String、Number、Boolean时，等价于Path对应的Node的`update()`操作。
当value为null时，等价于Path对应的Node的`remove()`操作。
当value为Map或JavaBean时，将value转为一颗子树替换当前value。

### Return

void

### Sample

```java
WdClient ref = WilddogIO("http://demo.wilddog.com/test");
// 等价 update(100);
ref.child("a/b").setValue(100);
// 等价 remove();
ref.child("a/b").setValue(null);
// 设置子树
Map<String, String> children = new HashMap<String, String>();
children.put("c", "cval");
ref.child("a/b").setValue(children);
// 自定义Entity
DOTAHero hero = new DOTAHero();
hero.setName("Nevermore");
hero.setHp(435);
hero.setMp(234);
ref.child("dota/heros/SF").setValue(hero);
```
----

## public void setValue(Object value, ResultHandler handler)
在当前Path进行覆盖性的赋值操作，将本地当前value或children（整颗子树）替换，并同步到云端，操作结果将回调用户自定义的handler。如果操作成功将触发已绑定的event，例如Change，ChildAdded等。
该函数是线程安全的，将阻塞其他的本地数据操作。

### Param

* value `Object`
value的类型可以为String、Number、Boolean、null、Map或满足JavaBean规范的实体。
当value为String、Number、Boolean时，等价于Path对应的Node的`update()`操作。
当value为null时，等价于Path对应的Node的`remove()`操作。
当value为Map或JavaBean时，将value转为一颗子树替换当前value。

* handler `ResultHandler`
handler包含三个callback函数，用户可以实现ResultHandler接口中的函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。`setValue(value)`等价于`setValue(value, null)`。
callback函数如下：
> `success()` 操作成功。
> `failure()` 操作异常或失败，WilddogError作为函数参数返回给调用者。
> `timeout()` 操作超时。

### Return

void

### Sample
自定义ResultHandler
```java
public MyHandler extends ResultHandler() {
	public void success() {}
	public void failure(WilddogError wilddogError) {
		System.out.println(wilddogError.getCode());
	}
	public void timeout() {}
}
```

```java
WdClient ref = WilddogIO("http://demo.wilddog.com/test");
ResultHandler handler = new ResultHandler();
// 等价 update(100);
ref.child("a/b").setValue(100, handler);
// 等价 remove();
ref.child("a/b").setValue(null, handler);
// 设置子树
Map<String, String> children = new HashMap<String, String>();
children.put("c", "cval");
ref.child("a/b").setValue(children, handler);
// 自定义Entity
DOTAHero hero = new DOTAHero();
hero.setName("Nevermore");
hero.setHp(435);
hero.setMp(234);
ref.child("dota/heros/SF").setValue(hero, new ResultHandler(){
	public void success() {
		System.out.println("set success");
	}
	public void failure(WilddogError wilddogError) {}
	public void timeout() {}
});
```
----

## public WdClient push(Object value)
在当前Path进行新添加操作，将在本地为新数据生成一个唯一ID，该ID将作为当前path的子节点，且作为新数据的父节点。同时同步到云端。如果操作成功将触发已绑定的event。最后将返回新ID的引用对象WdClient。
该函数是线程安全的，将阻塞其他的本地数据操作。

### Param
* value `Object`
value的类型可以为String、Number、Boolean、null、Map或满足JavaBean规范的实体。

* handler `ResultHandler`
handler包含三个callback函数，用户可以实现ResultHandler接口中的函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。`push(value)`等价于`push(value, null)`。
callback函数如下：
> `success()` 操作成功。
> `failure()` 操作异常或失败，WilddogError作为函数参数返回给调用者。
> `timeout()` 操作超时。

### Return
WdClient 新ID的引用对象

### throws Exception
将操作异常上抛给用户

### Sample

```java
WdClient ref = WilddogIO("http://demo.wilddog.com/test");
// 添加增加一个数值，将生成一个新ID，操作结果为{"-JmpzI81egafHZo5":100}， 返回的path为“/test/a/b/-JmpzI81egafHZo5”
WdClient  newRef = ref.child("a/b").push(100);
// 添加一个实体
DOTAHero hero = new DOTAHero();
hero.setName("Nevermore");
hero.setHp(435);
hero.setMp(234);
ref.child("heros").push(hero);

```
----

## public WdClient push(Object value,  ResultHandler handler)
在当前Path进行新添加操作，将在本地为新数据生成一个唯一ID，该ID将作为当前path的子节点，且作为新数据的父节点。同时同步到云端，操作结果将回调用户自定义的handler。如果操作成功将触发已绑定的event。最后将返回新ID的引用对象WdClient。
该函数是线程安全的，将阻塞其他的本地数据操作。

### Param
* value `Object`
value的类型可以为String、Number、Boolean、null、Map或满足JavaBean规范的实体。

### Return
WdClient 新ID的引用对象

### throws Exception
将操作异常上抛给用户

### Sample
自定义ResultHandler
```java
public MyHandler extends ResultHandler() {
	public void success() {}
	public void failure(WilddogError wilddogError) {
		System.out.println(wilddogError.getCode());
	}
	public void timeout() {}
}
```
```java
WdClient ref = WilddogIO("http://demo.wilddog.com/test");
ResultHandler handler = new MyHandler();
// 添加增加一个数值，将生成一个新ID，操作结果为{"-JmpzI81egafHZo5":100}， 返回的path为“/test/a/b/-JmpzI81egafHZo5”
WdClient  newRef = ref.child("a/b").push(100, handler);
// 添加一个实体
DOTAHero hero = new DOTAHero();
hero.setName("Nevermore");
hero.setHp(435);
hero.setMp(234);
ref.child("heros").push(hero, handler);

```
----

## public void update(Object value)
在当前Path进行赋值操作，与set的区别是不会影响到参数`value`中不涉及到的已存在的node，并同步到云端。如果操作成功将触发已绑定的event，例如Change，ChildAdded，ChildRemoved等。
该函数是线程安全的，将阻塞其他的本地数据操作。

### Param

* value `Object`
value的类型可以为String、Number、Boolean、null、Map或满足JavaBean规范的实体。
当value为null时，等价于Path对应的Node的`remove()`操作。


### Return

void

### Sample

```java
WdClient ref = WilddogIO("http://demo.wilddog.com/test");
ref.child("a/b").update(100);
// 等价 remove();
ref.child("a/b").update(null);
// 设置子树
Map<String, String> children = new HashMap<String, String>();
children.put("c", "cval");
ref.child("a/b").update(children);
// 添加一个实体
DOTAHero hero = new DOTAHero();
hero.setName("Nevermore");
hero.setHp(435);
hero.setMp(234);
ref.child("heros").update(hero);
```
----

## public void update(Object value, EventHandler handler)
在当前Path进行赋值操作，与set的区别是不会影响到参数`value`中不涉及到的已存在的node，并同步到云端，操作结果将回调用户自定义的handler。如果操作成功将触发已绑定的event，例如Change，ChildAdded，ChildRemoved等。
该函数是线程安全的，将阻塞其他的本地数据操作。

### Param

* value `Object`
value的类型可以为String、Number、Boolean、null、Map或满足JavaBean规范的实体。
当value为null时，等价于Path对应的Node的`remove()`操作。

* handler `ResultHandler`
handler包含三个callback函数，用户可以实现ResultHandler接口中的函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。`update(value)`等价于`update(value, null)`。
callback函数如下：
> `success()` 操作成功。
> `failure()` 操作异常或失败，WilddogError作为函数参数返回给调用者。
> `timeout()` 操作超时。

### Return

void

### Sample
自定义ResultHandler
```java
public MyHandler extends ResultHandler() {
	public void success() {}
	public void failure(WilddogError wilddogError) {
		System.out.println(wilddogError.getCode());
	}
	public void timeout() {}
}
```
```java
WdClient ref = WilddogIO("http://demo.wilddog.com/test");
ResultHandler handler = new MyHandler();
ref.child("a/b").update(100, handler);
// 等价 remove();
ref.child("a/b").update(null, handler);
// 设置子树
Map<String, String> children = new HashMap<String, String>();
children.put("c", "cval");
ref.child("a/b").update(children, handler);
// 添加一个实体
DOTAHero hero = new DOTAHero();
hero.setName("Nevermore");
hero.setHp(435);
hero.setMp(234);
ref.child("heros").update(hero, hanlder);
```
----

## public void remove()
在当前Path进行删除操作，并同步到云端。如果操作成功将触发已绑定的event，例如Change，ChildRemoved。
该函数是线程安全的，将阻塞其他的本地数据操作。

### Return
void

### Sample

```java
WdClient ref = WilddogIO("http://demo.wilddog.com/test");
ref.child("a/b").remove();
```
----

## public void remove(ResultHandler handler)
在当前Path进行删除操作，并同步到云端，操作结果将回调用户自定义的handler。如果操作成功将触发已绑定的event，例如Change，ChildRemoved。
该函数是线程安全的，将阻塞其他的本地数据操作。

### Param
* handler `ResultHandler`
handler包含三个callback函数，用户可以实现ResultHandler接口中的函数，如果某个callback函数没有响应的处理，接口实现为`{}`函数即可。`remove(value)`等价于`remove(value, null)`。
callback函数如下：
> `success()` 操作成功。
> `failure()` 操作异常或失败，WilddogError作为函数参数返回给调用者。
> `timeout()` 操作超时。

### Return
void

### Sample
```java
public MyHandler extends ResultHandler() {
	public void success() {}
	public void failure(WilddogError wilddogError) {
		System.out.println(wilddogError.getCode());
	}
	public void timeout() {}
}
```
```java
WdClient ref = WilddogIO("http://demo.wilddog.com/test");
ResultHandler handler = new MyHandler();
ref.child("a/b").remove(handler);
```
----