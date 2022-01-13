<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { fetchAccount } from '@/api/account'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null,
      accountQuery:{
        type: 'month'
      }
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.showLoading()
      fetchAccount(this.accountQuery).then(response => {
        const xData = (function() {
            const data = []
            for(let j = response.data.sta_year;j<=response.data.end_year; j++){
              var up = 0
              var down = 0;
              if (j == response.data.sta_year) {
                up = response.data.sta_month
                down = 12
              }else if (j == response.data.end_year){
                up = 1
                down = response.data.end_month
              }else {
                up = 1
                down = 12
              }
                for (let i = up;i<= down;i++){
                    data.push(j + '年' + i + '月')
                }
            }
            return data
        }())
        this.chart.setOption({
            backgroundColor: '#344b58',
            title: {
            text: 'statistics',
            x: '20',
            top: '20',
            textStyle: {
                color: '#fff',
                fontSize: '22'
            },
            subtextStyle: {
                color: '#90979c',
                fontSize: '16'
            }
            },
            tooltip: {
            trigger: 'axis',
            axisPointer: {
                textStyle: {
                color: '#fff'
                }
            }
            },
            grid: {
            left: '5%',
            right: '5%',
            borderWidth: 0,
            top: 150,
            bottom: 95,
            textStyle: {
                color: '#fff'
            }
            },
            calculable: true,
            xAxis: [{
            type: 'category',
            axisLine: {
                lineStyle: {
                color: '#90979c'
                }
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitArea: {
                show: false
            },
            axisLabel: {
                interval: 0

            },
            data: xData
            }],
            yAxis: [{
            type: 'value',
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                color: '#90979c'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0
            },
            splitArea: {
                show: false
            }
            }],
            dataZoom: [{
            show: true,
            height: 30,
            xAxisIndex: [
                0
            ],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
                color: '#d3dee5'

            },
            textStyle: {
                color: '#fff' },
            borderColor: '#90979c'

            }, {
            type: 'inside',
            show: true,
            height: 15,
            start: 1,
            end: 35
            }],
            series: [
            {
            name: 'male',
            type: 'bar',
            stack: 'total',
            itemStyle: {
                normal: {
                color: 'rgba(0,191,183,1)',
                barBorderRadius: 0,
                label: {
                    show: true,
                    position: 'top',
                    formatter(p) {
                    return p.value > 0 ? p.value : ''
                    }
                }
                }
            },
            data: response.data.price
            },
            {
            name: 'average',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
                normal: {
                color: 'rgba(252,230,48,1)',
                barBorderRadius: 0,
                label: {
                    show: true,
                    position: 'top',
                    formatter(p) {
                    return p.value > 0 ? p.value : ''
                    }
                }
                }
            },
            data: response.data.number
            }
            ]
        })
      })
      this.chart.hideLoading()
    }
  }
}
</script>
