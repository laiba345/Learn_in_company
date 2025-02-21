# Vue中父子传递数据的两种写法
- 1. 普通写法； props: ['title', 'open', 'type', 'options', 'image', 'container', 'visible', 'multiple', 'attribute', 'Questions'],
- 2. 拥有类型和默认值的写法（主要是可以使用默认值的写法，**防止应用父组件传递过来的数据.length的时候控制台出现报错**）
 ```
props: {
  title: {
    type: [String, Array], 
    default: ''  
  },
  open: Boolean,
  type: String,
  options: Array,
  image: String,
  container: String,
  visible: String,
  multiple: Boolean,
  attribute: {
    type: Array,
    default: () => []  
  },
  Questions: Boolean
},
```
