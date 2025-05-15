```
// 简洁版本
const dataZoom = this.myChart.getOption().dataZoom[0];
      const newStart = Math.max(0, Math.min(dataZoom.start + offset, 100 - (dataZoom.end - dataZoom.start)));
      const newEnd = Math.min(100, Math.max(dataZoom.end + offset, dataZoom.end - dataZoom.start));
      
      this.myChart.setOption({
        dataZoom: [{
          start: newStart,
          end: newEnd
        }]
      }, {
        lazyUpdate: true  // 延迟更新
      });
    }

// 第二种，复杂版本； 
const dataZoom = this.myChart.getOption().dataZoom[0];
    let start = dataZoom.start + offset;
    let end = dataZoom.end + offset;

    if (start < 0) {
      start = 0;
      end = dataZoom.end - dataZoom.start;
    }
    if (end > 100) {
      end = 100;
      start = 100 - (dataZoom.end - dataZoom.start);
    }

    this.myChart.setOption({
      dataZoom: [
        { start, end },
        { start, end }
      ]
    });
```
