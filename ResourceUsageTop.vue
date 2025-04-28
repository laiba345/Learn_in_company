```
<template>
  <SimpleChart
    ref="resourceChart"
    :width="width"
    :height="height"
    :title="title"
    :legend="legend"
    :grid="grid"
    :xAxis="xAxis"
    :yAxis="yAxis"
    :seriesType="seriesType"
    :datasetSource="datasetSource"
    :legendList="legendList"
    :customTooltip="tooltip"
    :colors="colors"
  />
</template>

<script>
import SimpleChart from '@/components/chart/SimpleChart.vue';

export default {
  name: 'ResourceUsageTop',
  components: {
    SimpleChart
  },
  data() {
    return {
      width: '62vw',
      height: '400px',
      legend: {
        show: true,
        bottom: '1%',
        textStyle: {
          color: '#333'
        }
      },
      legendList: ['YBK1', 'YBK2', 'YBK3', 'YBK4', 'YBK5'],
      grid: {
        top: '15%',
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      seriesType: 'line',
      colors: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae'],
      datasetSource: [
        ['time', 'YBK1', 'YBK2', 'YBK3', 'YBK4', 'YBK5'],
        ['10:00', 5, 25, 23, 15, 5],
        ['12:00', 30, 27, 20, 18, 0],
        ['14:00', 38, 28, 10, 15, 0],
        ['16:00', 35, 28, 20, 25, 15],
        ['18:00', 28, 35, 25, 28, 20],
        ['20:00', 30, 30, 23, 10, 10],
        ['22:00', 32, 28, 25, 3, 5],
        ['00:00', 33, 28, 28, 5, 10],
        ['2:00', 33, 28, 30, 5, 18],
        ['4:00', 33, 28, 30, 10, 15],
        ['6:00', 33, 15, 30, 15, 5],
        ['8:00', 33, 10, 30, 13, 10],
        ['10:00', 35, 3, 30, 10, 10]
      ],
      seriesConfig: {
        symbol: 'none',
        label: {
          show: false
        }
      }
    };
  }
};
</script>
```

## 原先的
```
<template>
  <div id="chart-container2" style="width: 62vw; height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'ResourceUsageChart',
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chartDom = document.getElementById('chart-container2');
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['YBK1', 'YBK2', 'YBK3', 'YBK4', 'YBK5'],
          bottom: '1%'
        },
        grid: {
          top: '6%',
          left: '3%',
          right: '2%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00', '2:00', '4:00', '6:00', '8:00', '10:00'], 
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20,
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: 'YBK1',
            type: 'line',
            symbol: 'none',
            data: [5, 30, 38, 35, 28, 30, 32, 33, 33, 33, 33, 33, 35]
          },
          {
            name: 'YBK2',
            type: 'line',
            symbol: 'none',
            data: [25, 27, 28, 28, 35, 30, 28, 28, 28, 28, 15, 10, 3]
          },
          {
            name: 'YBK3',
            type: 'line',
            symbol: 'none',
            data: [23, 20, 10, 20, 25, 23, 25, 28, 30, 30, 30, 30, 30]
          },
          {
            name: 'YBK4',
            type: 'line',
            symbol: 'none',
            data: [15, 18, 15, 25, 28, 10, 3, 5, 5, 10, 15, 13, 10]
          },
          {
            name: 'YBK5',
            type: 'line',
            symbol: 'none',
            data: [5, 0, 0, 15, 20, 10, 5, 10, 18, 15, 5, 10, 10]
          }
        ]
      };
      option && myChart.setOption(option);
    }
  }
};
</script>
```
