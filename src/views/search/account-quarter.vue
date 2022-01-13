<template>
  <div class="chart-container">
    <quarter-chart height="100%" width="100%" />
  </div>
</template>

<script>
import QuarterChart from "./components/QuarterChart";

export default {
  name: "AccountQuarter",
  components: { QuarterChart },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>