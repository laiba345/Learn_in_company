## 1. 调整横坐标的距离，比如横坐标与柱子没有很好对应上
- 通过axisLabel中的interval和formatter以及rich属性来设置； 
```
xAxis: {
  type: 'category',
  data: ['FOL', 'FVN', 'FJZ', 'FSJ', 'FTX', 'FCZ'],
  axisLabel: {
    fontSize: 11,
    color: '#B9E8FF',
    interval: 0, 
    formatter: (value: any) => {
      return `{label|${value}}` 
    },
    rich: {
      label: {
        padding: [0, 0, 0, 10], 
        color: '#B9E8FF',
        fontSize: 11
      }
    }
  },
  axisLine: {
    lineStyle: {
      color: 'rgb(209, 212, 215)'
    }
  },
  axisTick: {
    show: false
  }
},
```

## 背景图属性（始终完全充满屏幕，不随着浏览器缩放而改变）
- 示例代码：background: url('../echarts/dashboard/MapThree.png') no-repeat 0 0 / 100% 100%;
  - url 表示背景图路径
  - no-repeat 表示背景图不进行重复
  - 0 0 表示背景图的位置坐标，指定背景图放置在容器的哪个位置，
    - 0 水平位置为0 和 垂直位置也为0，即将背景图放置到元素的左上角
  - / 100% 100%
    - 背景图的宽度和高度始终被拉伸到容器的100% 