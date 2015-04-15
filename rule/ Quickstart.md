# Quickstart
Wilddog提供了一种类似于`JavaScript`语法的表达式规则，可以轻松的定义自己的数据读写权限与数据校验。配合Wilddog的用户系统，提供了简单的身份验证，可以定义谁有权限读写什么数据。Wilddog的规则在服务器的Rule引擎中计算，保证了不会绕过rule操作数据。

## 理解Wilddog Rule
Wilddog Rule用于限制用户读写应用的数据，以确保数据的结构。Rule分三种类型，`.read`，`.write`，`.validate`，每个类型对应一个类似`JavaScript`语法的表达式。快速了解见下表：
Rule 类型     | 描述
-------- | ---
.read | 定义用户允许读取的数据规则
.write    | 定义用户允许写的数据规则
.validate     | 定义新数据的校验条件，当符合该条件才能添加新数据

创建应用时将系统将设置默认规则：
```javascript
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
上述的默认规则，表示数据从root节点开始所有读写请求都被允许。

## Rule 内置对象
Wilddog Rule引擎提供了多个内置预设对象，更便捷更丰富的构建安全规则，包含内置预设对象如下：
内置对象     | 描述
-------- | ---
now| 请求到达服务端时，服务端生成的时间戳
root|`RuleDataSnapshot`类型的对象，代表请求操作前，根节点数据的引用。
newData| `RuleDataSnapshot`类型的对象，代表当前路径节点被操作后的新数据，此时新数据并未生效持久化。
data| `RuleDataSnapshot`类型的对象，代表当前路径节点被操作前的原始数据。
$variables| 代表当前路径节点的节点名称（key）作为变量使用。 
auth| `Auth`类型对象，代表登录的用户对象。

例子，下面的Rule规则确保，当前用户只能修改自己的nickname，且数据写入`/nickname`节点必须是少于100个字符的字符串：
```javascript
{
  "rules": {
	".read" : true,
    "users" : {
		$userId : {
			 ".write" : auth.uid === $userId,
			 ".validate" : "newData.isString() && newData.val().length() < 100"	
		}
    }
  }
}
```
你设计自己的App树型数据时，使用结构化的数据来替代关系型数据，这样就可以使用`$` + 变量名来表示某一节点下的所有子节点，变量代表了子节点名称（key）。
无论你使用哪种登录方式，在服务端都将生成`auth`对象，通常在App的数据节点中，使用userId作为数据节点来限制用户的读写权限。


