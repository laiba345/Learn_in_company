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
