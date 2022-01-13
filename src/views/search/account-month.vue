<template>
  <div class="chart-container">
    <month-chart height="100%" width="100%" />
  </div>
</template>

<script>
import MonthChart from "./components/MonthChart";

export default {
  name: "AccountMonth",
  components: { MonthChart },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>