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
