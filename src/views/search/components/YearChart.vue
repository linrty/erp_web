<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
import resize from "@/components/Charts/mixins/resize";
import { fetchAccount } from "@/api/account";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "year-chart",
    },
    id: {
      type: String,
      default: "year-chart",
    },
    width: {
      type: String,
      default: "200px",
    },
    height: {
      type: String,
      default: "200px",
    },
  },
  data() {
    return {
      chart: null,
      accountQuery: {
        type: "year",
      },
    };
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      this.chart.showLoading();
      fetchAccount(this.accountQuery).then((response) => {
        const xData = (function () {
          const data = [];
          for (
            let j = response.data.sta_year;
            j <= response.data.end_year;
            j++
          ) {
            data.push(j + "年");
          }
          return data;
        })();
        this.chart.setOption({
          backgroundColor: "#344b58",
          title: {
            text: "年度台账",
            x: "20",
            top: "20",
            textStyle: {
              color: "#fff",
              fontSize: "22",
            },
            subtextStyle: {
              color: "#90979c",
              fontSize: "16",
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              textStyle: {
                color: "#fff",
              },
            },
          },
          grid: {
            left: "5%",
            right: "5%",
            borderWidth: 0,
            top: 150,
            bottom: 95,
            textStyle: {
              color: "#fff",
            },
          },
          legend: {
            x: "5%",
            top: "10%",
            textStyle: {
              color: "#90979c",
            },
            data: ["订单数量", "总收入"],
          },
          calculable: true,
          xAxis: [
            {
              type: "category",
              axisLine: {
                lineStyle: {
                  color: "#90979c",
                },
              },
              splitLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              splitArea: {
                show: false,
              },
              axisLabel: {
                interval: 0,
              },
              data: xData,
            },
          ],
          yAxis: [
            {
              type: "value",
              splitLine: {
                show: false,
              },
              axisLine: {
                lineStyle: {
                  color: "#90979c",
                },
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                interval: 0,
              },
              splitArea: {
                show: false,
              },
            },
          ],
          dataZoom: [
            {
              show: true,
              height: 30,
              xAxisIndex: [0],
              bottom: 30,
              start: 10,
              end: 80,
              handleIcon:
                "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
              handleSize: "110%",
              handleStyle: {
                color: "#d3dee5",
              },
              textStyle: {
                color: "#fff",
              },
              borderColor: "#90979c",
            },
            {
              type: "inside",
              show: true,
              height: 15,
              start: 1,
              end: 35,
            },
          ],
          series: [
            {
              name: "总收入",
              type: "bar",
              stack: "total",
              itemStyle: {
                normal: {
                  color: "rgba(0,191,183,1)",
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    position: "top",
                    formatter(p) {
                      return p.value > 0 ? p.value : "";
                    },
                  },
                },
              },
              data: response.data.price,
            },
            {
              name: "订单数量",
              type: "line",
              stack: "total",
              symbolSize: 10,
              symbol: "circle",
              itemStyle: {
                normal: {
                  color: "rgba(252,230,48,1)",
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    position: "top",
                    formatter(p) {
                      return p.value > 0 ? p.value : "";
                    },
                  },
                },
              },
              data: response.data.number,
            },
          ],
        });
      });
      this.chart.hideLoading();
    },
  },
};
</script>
