# defineProps
```
const props = defineProps<{ name: string }>();
```
解释：上述为TS的写法，使用了泛型参数来声明props类型，上述定义了一个名为name的prop，类型为string

# Vue3支持两种声明方式
## 1. 运行时声明（传统方式）
```
const props = defineProps({
  name: {
    type: String,
    required: true,
    default: ''
  }
})
```
# 2. 类型声明（推荐在TS中使用）
```const props = defineProps<{
  name: string       // 必填属性
  age?: number       // 可选属性  在属性冒号前面加上问号
  items: string[]    // 数组类型
  metadata: {        // 对象类型
    id: number
    status: boolean
  }
}>();
```
# 3. 设置默认值
- 当使用类型声明方式时，可以通过withDefault设置默认值；
```
const props = withDefaults(defineProps<{
  name: string
  size?: number
}>(), {
  size: 100
});
```
## 4. 访问Props
- 在模板中可以直接使用
```
<template>
  <div>{{ name }}</div>
</template>
```
- 在脚本中需要通过props对象访问；(在script中）
```
onMounted(() => {
  console.log(props.name)
})
```
## 5. DOM引用的实现
```
const chartRef = ref<HTMLDivElement | null>(null);
```
- 上述是Vue3中的组合式API写法
- ref的作用
  - 创建一个响应式引用，用于访问 DOM 元素
  - 泛型<HTMLDivElement | null> 指定引用的元素类型
  - 初始值设为null是推荐做法，因为DOM元素在组件挂载前不存在
- 模板绑定
  - 在模板中通过ref属性绑定；
```
<template>
  <div ref="chartRef" class="chart"></div>
</template>
```
