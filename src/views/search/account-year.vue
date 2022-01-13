<template>
  <div class="chart-container">
    <year-chart height="100%" width="100%" />
  </div>
</template>

<script>
import YearChart from "./components/YearChart";

export default {
  name: "AccountYear",
  components: { YearChart },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>