/*
Title: Snapshot
*/



# Snapshot
EventHandler触发时，作为参数传递给用户。如果是Changed、ChildChanged、ChildAdded接口获得最新的数据；如果是ChildRemoved接口获得被删除的数据。

## public Object value()
获得当前节点的数据。

### Return
`Object` 如果是叶子节点，返回String、Boolean、Number类型；如果包含子树，将返回`Map<String, Object>`。

----

## public long numChildren()
获得子节点的总数。

### Return
`long` 子节点个数 。

----

## public boolean hasChild(String key)
是否包含指定子节点。

### Param
* key `String`
子节点名称。

### Return
`boolean` true为包含指定子节点，false为不包含。

----

## public boolean hasChildren()
是否包含子节点。

### Return
`boolean` true为包含子节点，false为不包含。

----

## public Snapshot child(String node)
获得指定子节点的Snapshot。

### Param
* node `String` 
子节点名称。

### Return
`Snapshot` 

----

## public List children()
获得所有子节点的Snapshot集合。

### Return
`List<DataSnapshot>` 子节点Snapshot集合。 

----

## public String key()
获得当前节点的名称

### Return
`String` 节点名称 

----
