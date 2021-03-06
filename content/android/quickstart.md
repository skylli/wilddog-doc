/*
Title: 快速入门
Sort: 1

*/


# Android 快速入门

## 第一步 创建一个账户
你需要做的第一件事是注册一个Wilddog的免费账号。你将拥有独立、属于你自己的项目空间。

## 第二步 创建App
进入控制面板，新建一个App项目，你需要为新的App起一个响亮的名字，并且需要设置一个唯一AppId作为你的项目访问的URL（appId.wilddogio.com）。我们将使用这个URL存储和同步数据。

我们将提供Andorid与Java两个版本的SDK。Java SDK没有依赖任何Andorid特性，并提供一部分接口需要在本地实现。Android SDK使用了sqlite、Andorid log等。

创建App成功后，Wilddog将为你初始化一个TreeDB（树型数据库），你就可以操作这个数据库了。

## 第三步 安装Wilddog
在你的Android应用程序中，可以使用Maven在你的项目中添加一个依赖或者在官网下载最新的SDK。

> **使用Maven**
> 如果使用Maven构建你的应用程序，你可以在pom.xml添加以下依赖。
> 
> Android SDK:
> ```
<dependency>
  <groupId>com.wilddog.client</groupId>
  <artifactId>wilddog-android</artifactId>
  <version>[1.0.0,)</version>
</dependency>
>```
> Java SDK:
>```
<dependency>
  <groupId>com.wilddog.client</groupId>
  <artifactId>wilddog-sdk</artifactId>
  <version>[1.0.0,)</version>
</dependency>
>```
 
----


> **Download**
> 你可以在这下载最新的Wilddog SDK：
> [Download Wilddog Android SDK](https://cdn.wilddog.com/android/client/current/wilddog-android.jar)
> [Download Wilddog Java SDK](https://cdn.wilddog.com/android/client/current/wilddog-android.jar)


## 第四步 连接到Wilddog
在操作数据库之前，需要先连接到wilddog云端。使用SDK，通过你App的URL创建一个WilddogIO引用。
```Java
WdClient client = new WilddogIO("http://<appId>.wilddogio.com/");
```
`WilddogIO()`的参数URL可以包含一个URI，可以用于定位到数据的路径节点上。将树型数据的某一节点可以看作一个path，那么URI可以作为path使用，上面代码将定位到数据的root节点。如果URL为`http://<appId>.wilddogio.com/message`，那么URI为`/message`。

## 第五步 读写数据
WdClient提供了数据读写API，通过`setValue()` `update()` `push()` `remove()` 修改对应节点的数据；通过`on()`立即读取数据，并监听某一节点数据的持续变化。

### 读数据
先为wdclient附加一个监听event处理，然后数据一旦有变化，可以同步到最新的数据。通过`on()`监听对应节点，并读取到数据，你需要实现一个接口`EventHandler`。
```Java
client.on(new EventHandler(){
	  public void onChildAdded(Snapshot data) {}
	  public void onChildChanged(Snapshot data) {}
	  public void onChildRemoved(Snapshot data) {}
	  public void onChanged(Snapshot data) {
	     System.out.println(data.value());
	  }
});
```

### 写数据
一旦我们有一个WilddogIO引用，我们可以使用setValue给该节点设置值，值的类型为`String` `Boolean` `Number` `Map<String, Object>` 或者符合JavaBean规范的实体。
```Java
client.setValue("hello world!!!");
```
如果有client通过`on()`监听了相同path，那么这个client将收到上面`setValue()`的新值。

