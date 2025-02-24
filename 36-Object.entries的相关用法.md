# Object.entries的相关用法
```
for (const [key, value] of Object.entries(this.containerList)) {
  this.$set(value, 'showborder', false);
}
```
- 解析
  - Object.entries(this.containerList)；
    - 该方法将this.containerList对象转换为一个由[key, value]对组成的数组，每个key是containerList对象的键，value是对应的值。
  - for (const [key, value] of ...)
    - 使用 for...of 循环遍历每个 [key, value] 对。对于 containerList 中的每个条目，key 是属性名，value 是属性值。
  - this.$set(value, 'showborder', false)
    - this.$set是Vue中的一个方法，用来在Vue实例中设置对象的属性，Vue2中常用，
      - 尤其是当Vue不能检测到对象的属性变化时，$set可以确保对象的响应性；
    - 将每个 containerList 条目的 showborder 属性设置为 false，从而使这些项的边框不显示
   

  
