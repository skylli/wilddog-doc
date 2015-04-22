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


# 3 获取数据

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

与监听事件配合，在事件触发的时候作为参数传递给用户使用。不同的事件代表的含义不同。

* `changed()` 触发时， `snapshot` 代表该节点最新的数据，包含节点的value或者该节点的整个子树。
*  `childAdded()` 触发时， `snapshot` 代表新添加的子节点，包含新子节点的value或者新子节点的整个子树。
*  `childRemoved()` 触发时， `snapshot` 代表被删除的子节点，包含被删除的子节点的value或者它的整个子树。
*  `childChanged()` 触发时， `snapshot` 代表发生变化的子节点，包含子节点的alue或者子节点的整个子树。
注意以上获得的snapshot，不只包含有变化的数据，是被监控的节点的数据，如果为`childRemoved` 则为删除前的数据快照；如果为`changed()`    `childAdded()`  `childChanged()`则为变化后的数据快照。


# 4 修改数据

## 修改数据的方式

接口 | 描述
---- | ----
`setValue()` | 在当前Path进行覆盖操作，设置成最新的数据。将会取代已有的整个子树。
`push()` | 在当前Path进行新添加操作，将在本地为新数据生成一个唯一ID，该ID将作为当前path的子节点，且作为新数据的父节点。例如当前Path为 `/a/b`，push(1)，操作后变为 `/a/b/<id>`，新节点的值为1。
`update()` | 更新当前Path节点的数据，不会取代已存在的子节点。

## setValue()
Wilddo通过 `setValue()` 保存新的数据到App中，将替换当前Path节点的所有数据。我们将构建一个简单的Blog App，来理解这些API的使用。把我们的blog程序的数据保存到下面这个wilddog引用中：

```Java
Wilddog ref = new Wilddog("https://demoblog.wilddogio.com/wildblog");
```
开始，我们需要在wildblog app中创建一些用户，使用用户名作为节点的key，并包含用户的属性，昵称、出生年份、blog等级和访问量。因为每个用户有一个独一无二的用户名，最好使用`setValue()` ，而不是使用`push()`，`push()` 将动态创建一个唯一key作为节点名，但是这样没有什么意义。

创建一个blog的User类，并创建一些用户对象存储到wildblog中。这个User类需要符合JavaBean规范，只需要一个初始化属性的构造器和属性的getter方法。

```Java
public class User {
    private String nickName;
    private int birthYear;
    private int grade;
    private int pv;

    public User() {}

    public User(String nickName, int birthYear) {
        this.nickName = nickName;
        this.birthYear = birthYear;
        this.grade = 1;
        this.pv = 0;
    }

    public int getGrade() {
        return grade;
    }

	public int getPv() {
        return pv;
    }

    public String getNickName() {
        return nickName;
    }
    
    public long getBirthYear() {
        return birthYear;
    }
}

User jackson = new User("binxu", 1985);
User jason = new User("jibo", 1988);

Wilddog usersRef = ref.child("users");

Map<String, User> users = new HashMap<String, User>();
users.put("Jackson", jackson);
users.put("Jason", jason);

usersRef.setValue(users);

```

我们使用一个`Map` 对象保存数据。调用`setValue()`，会将Map和User类都映射成Json对象，最终将递归嵌套生成子树和子节点。现在，在浏览器输入 https://demoblog.wilddogio.com/wildblog/users/Jason， 将会看到wildblog的用户“Jason”的value，User类的属性形成了Jason节点的子节点。可以通过`setValue()` 重新设置用户的属性：

```Java
//使用 child() 选择子节点
usersRef.child("Jason").child("nickName").setValue("wangjibo");
usersRef.child("Jason").child("grade").setValue(2);

//在child()中使用'/'选择孙子节点
usersRef.child("Jackson/nickName").setValue("liaobinxu");
usersRef.child("Jackson/birthYear").setValue(1986);

// 新加一个用户，不使用User类
usersRef.child("Tim/nickName").setValue("beibei");
usersRef.child("Tim/birthYear").setValue(1983);
usersRef.child("Tim/grade").setValue(1);
usersRef.child("Tim/pv").setValue(0);
```
上面的例子，也可以作为添加新的用户，调用`child()` 可以接受不存在的Path，将会动态创建这些不存在的节点，所以可以用于新建操作。
目前，wildblog app经过操作后，Path `/wildblog/users/` 的 JSON Tree 如下：
```JSON
{
  "users": {
    "Jackson": {
      "birthYear": "1986",
      "nickName": "liaobinxu",
      "grade": 1,
      "pv": 0
 	},
    "Jason": {
      "birthYear": "1988",
      "nickName": "wangjibo",
      "grade": 2,
      "pv": 0
 	},
 	"Tim": {
      "birthYear": "1983",
      "nickName": "beibei",
      "grade": 1,
      "pv": 0
 	}
  }
}
```

**注意： 使用setValue()将覆盖当前位置的数据，包括下级所有子节点 。**

可以通过`setValue()` 设置数据的类型可以是：`String` `Long` `Integer` `Double` `Boolean` `Map<String, Object>`。支持这些类型可以构建任意数据结构， 例如 `Map` 可能包含另外一个 `Map`，使用 `Map` 替代User类：

```Java
Wilddog usersRef = ref.child("users");

Map<String, Object> jason = new HashMap<String, Object>();
Jason.put("birthYear", 1988);
Jason.put("nickName", "wangjibo");
Jason.put("grade", 1);
Jason.put("pv", 0);

Map<String, Map<String, Object>> users = new HashMap<String, Map<String, Object>>();
users.put("Jason", jason);

usersRef.setValue(users);
```

## update()
如果你想修改或新建，一个或多个子节点时，又不想覆盖其他子节点，可以使用`update()` 方法。

```Java
Wilddog jasonRef = usersRef.child("Jason");
Map<String, String> nickname = new HashMap<String, String>();
nickname.put("nickName", "Axe");
jasonRef.update(nickname);
```

上面代码更新用户Jason的nickName。如果我们使用 `setValue()` 而不是 `update()`，它将删除 `birthYear` `grade` `pv` 。

## push()
现在已经有了用户，需要增加一个发布blog的功能。你会想到使用`setValue`方法，这样是可以的。但是blog不像用户，用户可以使用唯一的用户名做key，blog的话要自己准备唯一key，不免有些麻烦。Wilddog提供一个`push()` 接口，这个接口将会为新建的数据创建一个唯一ID，这个唯一ID按照Wilddog的默认排序规则设计的，Wilddog默认的排序是按照字符串升序序列排序的，ID本身是按照时间戳转义的字符串。
我们可以将Blog以时间顺序添加到wildblog中，使用`push()`生成ID，并按照这个ID排序：

```Java
Wilddog blogsRef = ref.child("blogs");

Map<String, String> blog = new HashMap<String, String>();
blog.put("author", "Jason");
blog.put("title", "学习Wilddog笔记1");
blog.put("content", "hello world");

Wilddog newRef = blogsRef.push(blog);
System.out.println("create new key is : " + newRef.key());
```

`push()` 成功后返回新的ID的Ref，可以使用`ref.key()` 显示新的ID值。

## remove()

错误发布了一篇Blog，需要为用户提供一个删除的途径，那么在wildblog App中可以使用`remove()`。

```Java
Wilddog blogsRef = ref.child("blogs");

Map<String, String> blog = new HashMap<String, String>();
blog.put("author", "Jason");
blog.put("title", "学习Wilddog笔记11");
blog.put("content", "he he he");

Wilddog newRef = blogsRef.push(blog);
newRef.remove();
```








Adding a Completion Callback

If you'd like to know when your data has been committed, you can add a completion listener. Both setValue() and updateChildren() take an optional completion listener that is called when the write has been committed to the Firebase servers. If the call was unsuccessful for some reason, the listener will be passed an error object indicating why the failure occurred:

Copy
ref.setValue("I'm writing data", new Firebase.CompletionListener() {
    @Override
    public void onComplete(FirebaseError firebaseError, Firebase firebase) {
        if (firebaseError != null) {
            System.out.println("Data could not be saved. " + firebaseError.getMessage());
        } else {
            System.out.println("Data saved successfully.");
        }
    }
});

